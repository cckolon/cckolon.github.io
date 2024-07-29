---
layout: post
title: Integrating Random Functions on a Cluster with Temporal
excerpt_separator: <!--more-->
image: TODO
description: Using Temporal as a workflow manager to generate and integrate functions with Sympy across multiple computers.
---

In 2020, I read Lample and Charton's [Deep Learning for Symbolic Mathematics](https://arxiv.org/pdf/1912.01412). I had graduated with a math degree less than two years before, and was interested in applying neural networks to math. Specifically, I was interested in the search for [Lyapunov functions](https://en.wikipedia.org/wiki/Lyapunov_function), since I had embarked on a lengthy search for one during my undergraduate research. Finding Lyapunov functions is closely related to finding integrals, and the two share a tantalizing property - they are easy to verify but hard to compute. I tried to reproduce some of Lample and Charton's work on my own, but I wasn't a great programmer and I got distracted with my day job; I spent over 260 days at sea in 2020.

Last weekend I decided to give it another shot. I've changed a lot since 2020, and now programming _is_ my day job. I found it easier this time, but I chose to write here about the parts I found hard, and what surprised me about this project.
<!--more-->

The machine learning aspect of this project was not complex. In fact, my goal was less ambitious than the authors of the paper. Instead of creating a model which could perform integration, I wanted to create a model which could determine if a function was integrable. I would generate a bunch of random functions, use a computer algebra system (CAS) to try and integrate them, record which ones were integrable and which were not, and train a text classifier to determine which was which. Training these types of classifiers is a well-studied problem, and there are plenty of tutorials online, [like this one](https://huggingface.co/docs/transformers/en/tasks/sequence_classification). Rather than training a function from scratch, I chose to fine-tune [MathBERT](https://arxiv.org/abs/2105.00377), which is freely available [here](https://huggingface.co/tbs17/MathBERT).

The hard part, actually, was generating and integrating the functions in the first place. The authors of the original paper had a dataset of 20 million forward-generated integrals, and 100 million integrals total. While I planned to only use forward-generated integrals in my classification project, and I expected it to require less data since I was fine-tuning an existing model, dataset scale would clearly be a challenge.

## A Method to Generate Random Functions

Generating a random function seems easy at first thought, but it is hard to do so fairly. A naive approach might be to generate a string of symbols randomly, but not every combination of mathematical symbols is meaningful. For example, the following string has no meaning:

$$\frac 3+\log(()$$

There are some syntactical rules that we have to respect. To force this, we could try to generate random strings and only save the ones that are meaningful. The obvious problem with this is that it would be wasteful; much time would be used generating meaningless strings which will not be saved. It would be preferable to generate functions and already know that they are syntactically correct.

### Functions as Trees

If you are familiar with computer algebra systems, you may know that programs usually represent functions internally as _binary-unary trees_, also known as _Motzkin trees_ - a network of nodes, each of which has 0, 1, or 2 children.

![Binary-Unary Trees](/assets/media/integration/trees.png)

Examples of binary-unary trees [^sedgewick2013].
{: .img-caption}

[^sedgewick2013]: [Sedgewick and Flajolet. An Introduction to the Analysis of Algorithms. (2013). Course Notes Chapter 5.](https://aofa.cs.princeton.edu/online/slides/AAqa5.pdf)

To translate functions to binary-unary trees, we can split the functions by their operators. Here's an example:

![Decomposing a binary-unary tree](/assets/media/integration/binary_unary_decomp.png)

You can see from this example that there are three types of nodes:

- _Leaves_: these are nodes with no children, and they correspond to constants and variables (like $$3$$ or $$x$$).
- _Unary Nodes_: nodes with one child, corresponding to unary operators (like $$\sin$$ or $$\arctan$$).
- _Binary Nodes_: nodes with two children, corresponding to binary operators (like $$\times$$ or $$+$$).

![Labeling binary nodes, unary nodes, and leaves](/assets/media/integration/binary_unary_label.png)

This is [exactly how parsers work](https://itnext.io/writing-a-mathematical-expression-parser-35b0b78f869e) in graphing calculators and computer algebra systems.

### Generating Trees Randomly

The tree representation of functions makes it easy to ensure that a function is syntactically correct. All we have to do is generate a random binary-unary tree, and populate the nodes randomly. Even this, though, is not trivial. From the paper:

> However, sampling uniformly expressions with n internal nodes is not a simple task. Naive algorithms (such as recursive methods or techniques using fixed probabilities for nodes to be leaves, unary, or binary) tend to favour deep trees over broad trees, or left-leaning over right leaning trees.

This is a non-trivial problem, and doing it efficiently is both well-studied [^alonso1994] and a topic of current research [^lescanne2024]. Since the trees I wanted to generate aren't very large, I opted for the fairly simple algorithm presented by Lample and Charton.

Some vocabulary that will help with this part:

- Subtree: a part of a tree that is itself a tree.

![A subtree](/assets/media/integration/subtree.png)

- Internal node: a node that is _not_ a leaf. In other words, a binary or unary node.

![Highlighting internal nodes](/assets/media/integration/internal%20nodes.png)

To use the algorithm, we need to be able to calculate two numbers:

- $$D(e, n)$$: the number of subtrees with $$n$$ internal nodes that can be generated from $$e$$ starting nodes.
- $$P(L(e, n)=(k, a))$$: the probability that the next internal node is in position $$k$$ with $$a$$ children.

We can get a recursive expression for $$D(e, n)$$. To figure out the base cases, we know that it is not possible to have 

[^alonso1994]: [Alonso. Uniform generation of a Motzkin word. (1994). Theoretical Computer Science. 134-2: 529-536.](https://www.sciencedirect.com/science/article/pii/0304397594000867)

[^lescanne2024]: [Lescanne. Holonomic equations and efficient random generation of binary trees. (2024). ArXiv: 2205.11982.](https://arxiv.org/abs/2205.11982)
