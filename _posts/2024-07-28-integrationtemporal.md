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

