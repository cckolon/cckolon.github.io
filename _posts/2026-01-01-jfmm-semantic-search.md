---
layout: post
title: Semantic Search for the Navy's Nastiest Manual
image: /assets/media/florence-rl/flo-sutton-barto.webp
description: Building a web app to search the Joint Fleet Maintenance Manual.
---

During my last couple years in the Navy, I became intimately familiar with submarine quality assurance (QA). I went to QA school and became the QA officer (QAO) of PCU New Jersey. As part of my responsibilities, I had to review work packages and qualify sailors as proficient in quality maintenance.

The Navy's governing instruction concerning QA is a book called the Joint Fleet Maintenance Manual, or JFMM (pronounced "Jiff-m"). Weighing in at 3470 pages, the JFMM is not light reading. It contains passages like this:

> QA forms are used to create Objective Quality Evidence (OQE) when required by higher authority. While QA form instructions identify requirements for usage, they are not self-invoking. The use of a QA form is initiated from requirements of previous chapters within part I and part III of this volume...

Tough read!

I needed to search the JFMM many times per day, but my options were limited. NAVSEA delivers the JFMM as a PDF, so I needed to use Adobe reader (or Chrome) to search page-by-page for the info I was looking for. Since the manual was so long, each query took over a minute on our slow government-furnished laptops, which were bogged down with security bloatware. This was really frustrating.

After I left the Navy and started working in software, I learned that it was possible to create a much better search tool for the JFMM than what I had available on the boat, and so I registered [jfmm.net](https://jfmm.net) and built a semantic search engine. Here's how it works.

## Vector similarity search

The biggest thing holding my normal searches back was that my only search options were literal text search. So if I searched for "torque wrench selection", I would get nothing. To solve this, I needed to use semantic search.

I've [written about semantic search before](/2024/01/31/jrnlsearch/). Typically, a semantic search system uses _vector similarity search_. In vector similarity search, a lot of text chunks are separately _embedded_: fed through a machine learning model which produces vectors. These vectors typically have hundreds or thousands of dimensions. If the embedding vectors are close for two chunks, they have similar meaning, even if they don't share many words. To search through the chunks, the system embeds the user's query, and then searches for the nearest neighbors among the embedded documents (usually with a [vector database](https://en.wikipedia.org/wiki/Vector_database) optimized for such queries). A nice property of semantic search is that most of the computation (embedding the chunks) can be done ahead of time, where only the single query embedding has to be done at query-time.

The first iteration of jfmm.net was a pure vector similarity search engine. I extracted the text from the JFMM and chunked it with [Unstructured](https://github.com/Unstructured-IO/unstructured) (the open source version of [Unstructured.io](https://unstructured.io/)'s product). Then I embedded the data with [nomic-embed-text-1.5](https://huggingface.co/nomic-ai/nomic-embed-text-v1.5). I set up a cloud hosted Postgres database and installed the [pgvector](https://github.com/pgvector/pgvector) vector search extension, then uploaded all the data.

I built the site itself with [FastAPI](https://fastapi.tiangolo.com/), and used the [Sentence Transformers](https://huggingface.co/sentence-transformers) library for embedding user queries.

This worked great! There were a couple problems though.

- Hosted Postgres instances are expensive! The cheapest I could get them from DigitalOcean was $20/month, a chunk of change for a side project.
- Sentence Transformers wasn't optimized for the environment I was running it in (a CPU on a cloud server). It used a lot of RAM, forcing me to upsize my server, and I couldn't easily use quantization or another hack to make performance faster or cheaper.
- The search results often didn't seem to be exactly what I wanted - they would have related meanings, but the results wouldn't always be _answers_ to the questions I was asking. Often, the right answer was in the results, but it wasn't #1.

## JFMM.net V2

Late last year, while on paternity leave, I rewrote JFMM.net to address these problems.

### Swapping the database

First, I realized that Postgres was overkill for my purpose. Once I had chunked and embedded the JFMM, I did not need to make further changes to my vector database. Because of this, I could reset the database with every deployment, as long as my starting point already contained the embedded chunks.

The cheapest option would be a database that could run on a file in the container: [SQLite](https://sqlite.org/). Luckily, I was familiar with SQLite's vector extension, [`sqlite-vec`](https://github.com/asg017/sqlite-vec), which worked really well for this purpose. With `sqlite-vec`, I could set up a virtual table for storing embeddings and run queries like this:

```sql
SELECT e.chunk_id
FROM embedding_nomic_1_5 e
ORDER BY vec_distance_cosine(e.embedding, ?)
LIMIT 50
```

Where the placeholder `?` represents a query embedding.

I could embed the entire manual once on my high-powered local machine, generate the SQLite file, and send it to a persistent volume in my container. This is much faster than trying to generate all the embeddings in the cloud.
