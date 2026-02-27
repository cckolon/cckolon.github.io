---
layout: post
title: How to Remember Everything with Jrnl and Semantic Search
excerpt_separator: <!--more-->
image: /assets/media/semantic/jrnl_search_screengrab.webp
image_width: 523
image_height: 200
description: Note-taking in the command line with jrnl, and semantic search with Huggingface Sentence Transformers.
---

I am bad at taking notes, and I want to get better. There are two main obstacles that I face when I write down things that I want to remember. <!--more-->

**Taking notes is inconvenient.** I spend 90% of my work time in VSCode, either editing text or using the terminal, and using a note taking app requires me to context switch, load another application, and (worst of all) decide on where I'm going to store the note. Do I make another folder? Use a new note or an existing one?

**Retrieving notes is hard.** It's common for me to have some "must remember" piece of information---maybe a code snippet for a common task, or a note from a meeting---and write it down on one of my many note-taking apps: Google Keep, Obsidian, Slack DM to self, etc. Then when I actually need the information later, I can't remember where I put it. This gets really hard if I don't remember when I wrote it, or what phrasing I used. Often, I find myself going through old notes by date, or searching some unrelated piece of information that I know I wrote down around the same time. If that fails, I sometimes look through old slack messages, emails, or my browser history trying to rediscover information. If I wrote it down on paper, there's a high probability that the information is gone forever.

Recently, I resolved to start taking better notes, and decided to meet these challenges head on.

## Quick Info

- [GitHub Repo](https://github.com/cckolon/jrnl-search/)
- [PyPi project](https://pypi.org/project/jrnl-search/)
- [Installation](#how-to-run-it-yourself)

## Jrnl

To tackle the first challenge, I started using an application called [jrnl](https://jrnl.sh/en/stable/). Jrnl works from the command line and has [good VSCode integration](https://jrnl.sh/en/stable/external-editors/#visual-studio-code), so it fits into my existing workflow. For example, if I wanted to remember the right ratio of rice to water in my pressure cooker, I could write:

<!--Override to remove formatting from "to"-->
<div class="language-shell highlighter-rouge"><div class="highlight"><pre class="highlight"><code><span class="nv">$ </span>jrnl the right ratio of rice to water in a pressure cooker is 1-to-1.
</code></pre></div></div>

I can read the contents of today's entries in jrnl by writing:

<div class="language-shell highlighter-rouge"><div class="highlight"><pre class="highlight"><code><span class="nv">$ </span>jrnl <span class="nt">-on</span> today
┏━━━━━━━━━━━━━━━━━┓
┃  1 entry found  ┃
┗━━━━━━━━━━━━━━━━━┛
2023-12-23 07:48:22 PM the right ratio of rice to water in a pressure cooker is 1-to-1.
</code></pre></div></div>

Jrnl is free, open-source, and extensible, so it's compatible with my ethics as well!

## Retrieving Notes

To address my second concern, jrnl has [several built-in ways](https://jrnl.sh/en/stable/usage/#viewing-and-searching-entries) to search for notes. You can search by date:

```shell
$ jrnl -to today  # everything
$ jrnl -10  # last 10 entries
$ jrnl -from "last year" -to march  # date range
```

You can also filter by tag. Use `@` at the beginning of words to tag entries.

```shell
$ jrnl Use @python dataclasses to quickly create class constructors.
$ jrnl @python
┏━━━━━━━━━━━━━━━━━┓
┃  1 entry found  ┃
┗━━━━━━━━━━━━━━━━━┛
2023-12-25 02:54:41 PM Use @python dataclasses to quickly create class constructors.
```

You can also search for untagged text.

```shell
$ jrnl -contains dataclasses
┏━━━━━━━━━━━━━━━━━┓
┃  1 entry found  ┃
┗━━━━━━━━━━━━━━━━━┛
2023-12-25 02:54:41 PM Use @python dataclasses to quickly create class constructors.
```

This is pretty good---on par with other note apps---but it can still be hard to retrieve the notes I want. In an app like Obsidian, I have a whole GUI which previews and lays out my notes, making it easier to retrieve information that I'm looking for. In jrnl, all I have is the command line. I would have to know ahead of time the exact wording or tags I used if I want to find a specific piece of information.

I had already decided I was done with Obsidian (and similar apps) precisely *because* I had to organize my notes when writing and saving them. I wanted to just take my thoughts (about anything) and throw them in a big bucket. To retrieve the notes effectively, I needed a better search strategy.

## Semantic Search

Semantic search is a way to search for text by meaning, rather than by directly matching words or phrases. This is more powerful than traditional keyword search because it can find synonyms or similarities which do not use the exact same words. Modern transformer models convert text to vector embeddings: a list of numbers which represents the *meaning* of the phrase. In transformer-based semantic search, a list of phrases or sentences is converted into a list of vector embeddings.

![Three phrases embedded into a vector space.](/assets/media/semantic/embeddings.webp){: width="600" height="488"}

Three phrases embedded into a vector space. The vectors are embedded in 2-dimensional space in the image. In reality, hundreds of dimensions are typically used.
{: .img-caption}

In the above image, vector embeddings have been generated for three phrases. Closer embeddings tend to be related. Transformer-based semantic search exploits this fact by embedding the search query, and then retrieving the entries closest to the query embedding.

![Vector embeddings for a question and answer.](/assets/media/semantic/questionembedding.webp){: width="600" height="346"}

Crucially, it doesn't matter if the question uses the exact same words, because embeddings of phrases with similar *meanings* are clustered closely, regardless of phrasing.

![The same question, phrased differently.](/assets/media/semantic/phrasing.webp){: width="600" height="438"}

Finding the closest entry is usually straightforward. Three main similarity metrics can be used. The simplest is the actual distance between the vector tips, usually called the L2 norm. More commonly, the squared L2 norm is used, because it is easier to calculate and possesses some favorable qualities. The [dot product](https://en.wikipedia.org/wiki/Dot_product) is another common option, and is calculated by taking the of the products of corresponding elements of the vectors. Normalizing the dot product (dividing by vector length) gives the [cosine similarity](https://en.wikipedia.org/wiki/Cosine_similarity), a measure of the angle between the two vectors. All these similarity metrics lead to similar results, but they may perform better or worse depending on how the embedding models are trained.

## Running Semantic Search Locally

Huggingface has a great python module for vector embeddings called [Sentence Transformers](https://huggingface.co/sentence-transformers), and a great tutorial on [using this library to perform semantic search](https://huggingface.co/learn/nlp-course/chapter5/6?fw=tf). Sentence Transformers offers support for many models, and [a comparison page](https://www.sbert.net/docs/pretrained_models.html#model-overview) where they are evaluated against each other. Because of its top performance in semantic search, I decided to use [`multi-qa-mpnet-base-dot-v1`](https://huggingface.co/sentence-transformers/multi-qa-mpnet-base-dot-v1).

Jrnl saves its entries in a text file separated by newlines. My library, which I called `jrnl-search`, collects the entries (using jrnl's built-in methods) and embeds each one. The embeddings are saved as json, and each one is associated with an md5 hash of the original text prompt. This means that the prompt isn't re-saved as plaintext, which would defeat the purpose of jrnl's encryption option (this still is not secure, since the meaning of each entry can be approximately deduced from the embedding).

At runtime, `jrnl-search` first checks to see if all journal entries have embeddings by hashing each entry and comparing them to the list of keys in the embedding file. If any are missing, `jrnl-search` generates the embeddings and saves them to the embedding file.

When the user supplies a query, `jrnl-search` embeds that too, and finds the embedding's dot product with each of the entry embeddings. It then sorts these by similarity and displays the results in order on a table. The table is rendered with [rich](https://github.com/Textualize/rich) and embedded in the native terminal's [pager](https://en.wikipedia.org/wiki/Terminal_pager) using [`rich.console.Console.pager`](https://rich.readthedocs.io/en/stable/reference/console.html?highlight=pager#rich.console.Console.pager).

To improve execution speed, I made this process asynchronous using python's [asyncio](https://docs.python.org/3/library/asyncio.html) library. Then I packaged the script with [poetry](https://python-poetry.org/) and uploaded to [Pypi](https://pypi.org/). This means you can install it as a command line utility with [pipx](https://pipx.pypa.io/stable/installation/).

## How to Run It Yourself

- [Install python 3.10 or higher if you don't already have it](https://wiki.python.org/moin/BeginnersGuide/Download).
- [Install pipx](https://pipx.pypa.io/stable/installation/).
- [Install jrnl](https://jrnl.sh/en/stable/installation/).
- Install jrnl-search: `$ pipx install jrnl-search` (this takes a while since it installs some beefy ML libraries).
- Make some jrnl entries:
  - `$ jrnl this entry is about bats`
  - `$ jrnl this entry is not`
- Search for them (the first search may take a while since the models have to download):
  - `$ jrnl-search flying animals`

![a jrnl demo](/assets/media/semantic/jrnl_search.gif){: width="604" height="337"}

## Development Status and Future Work

The current version of `jrnl-search` has a few limitations that I'd like to work on:

- It does not support encrypted journals (or contain its own security).
- Multiple journals are not supported (only the default journal is embedded).
- It is slow and takes up a lot of space. I think loading the whole Sentence Transformers library is overkill; there's probably a more lightweight way to do it.

If you have suggestions or bugs, feel free to [make an issue](https://github.com/cckolon/jrnl-search/issues/new) in the github repo or [submit a PR](https://github.com/cckolon/jrnl-search/pulls)!
