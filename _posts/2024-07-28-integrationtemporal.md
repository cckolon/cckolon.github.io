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

## Quick Links

- [I only care about math](#generating-random-functions)

- [I only care about parallel Python code](#python-parallelism)

- [I only care about cluster computing]

- [I like reading code, not words](https://github.com/cckolon/intclass)

## Generating Random Functions

To start creating my dataset, I needed to generate a lot of functions randomly. Generating a random function seems easy at first thought, but it is hard to do so fairly. A naive approach might be to generate a string of symbols randomly, but not every combination of mathematical symbols is meaningful. For example, the following string has no meaning:

$$\frac 3+\log(()$$

There are some syntactical rules that we have to respect. To force this, we could try to generate random strings and only save the ones that are meaningful. The obvious problem with this is that it would be wasteful; much time would be used generating meaningless strings which will not be saved. It would be preferable to generate functions and already know that they are syntactically correct.

### Functions as Trees

If you are familiar with computer algebra systems, you may know that programs usually represent functions internally as _binary-unary trees_, also known as _Motzkin trees_ - a network of nodes, each of which has 0, 1, or 2 children.

![Binary-Unary Trees](/assets/media/integration/trees.png)

Examples of binary-unary trees[^sedgewick2013].
{: .img-caption}

[^sedgewick2013]: [Sedgewick and Flajolet. An Introduction to the Analysis of Algorithms. (2013). Course Notes Chapter 5.](https://aofa.cs.princeton.edu/online/slides/AAqa5.pdf)

To translate functions to binary-unary trees, we can split the functions by their operators. Here's an example:

![Decomposing a binary-unary tree](/assets/media/integration/binary_unary_decomp.png)

You can see from this example that there are three types of nodes:

- _Leaves_: these are nodes with no children, and they correspond to constants and variables (like $$3$$ or $$x$$).
- _Unary Nodes_: nodes with one child, corresponding to unary operators (like $$\sin$$ or $$\arctan$$).
- _Binary Nodes_: nodes with two children, corresponding to binary operators (like $$\times$$ or $$+$$).

Together, binary and unary nodes are also known as _Internal Nodes_. In other words, an internal node is a node that is _not_ a leaf.

![Labeling binary nodes, unary nodes, and leaves](/assets/media/integration/binary_unary_label.png)

This is [exactly how parsers work](https://itnext.io/writing-a-mathematical-expression-parser-35b0b78f869e) in graphing calculators and computer algebra systems.

### Generating Trees Randomly

The tree representation of functions makes it easy to ensure that a function is syntactically correct. All we have to do is generate a random binary-unary tree, and populate the nodes randomly.

This is a non-trivial problem, and doing it efficiently is both well-studied[^alonso1994] and a topic of current research[^lescanne2024]. Since the trees I wanted to generate aren't very large, I opted for the fairly simple algorithm presented by Lample and Charton.

[^alonso1994]: [Alonso. Uniform generation of a Motzkin word. (1994). Theoretical Computer Science. 134-2: 529-536.](https://www.sciencedirect.com/science/article/pii/0304397594000867)

[^lescanne2024]: [Lescanne. Holonomic equations and efficient random generation of binary trees. (2024). ArXiv: 2205.11982.](https://arxiv.org/abs/2205.11982)

The algorithm works by generating unassigned or "empty" nodes, and then "filling" them by deciding if they are leaves, unary, or binary. First, decide how many internal nodes we want in the tree. An internal node is a non-leaf (a binary or unary node). In this case, let's say we want three internal nodes.

Start with an empty node.

![One Node](/assets/media/integration/tree1.png)

Since there's only one node, it can't be a leaf, so randomly decide if it will be binary or unary. Let's say it's binary.

![A binary node and two empty children](/assets/media/integration/tree2.png)

Now there are two empty nodes, we decide the location of the next internal node. In this case, either the left node is an internal node, or it is a leaf and the right node is internal. We randomly decide again here, but note that if we are sampling fairly, the probabilities should not be 50/50! There are more possible trees where the left node is internal than trees where it is a leaf! I'll get back to how we calculate the sampling probability shortly.

![Compare the two tree groups](/assets/media/integration/tree_comparison.png)

Let's say the left node is internal, and we decide it's binary. Now there are three empty nodes.

![A binary node with two children. The left is binary and the right is empty](/assets/media/integration/tree3.png)

We still have one more internal node to assign. Let's say we decide it's unary and in position 3, making the other positions leaves.

![A binary node with two children. The left is binary. Its right child is unary. The rest of the nodes are leaves](/assets/media/integration/tree4.png)

Now we fill the leaves with numbers and variables, and the unary and binary nodes with unary and binary operators respectively.

![The same tree with operators, variables, and constants assigned](/assets/media/integration/tree5.png)

And we generate $$2\times(x+\sin x)$$.

### Sampling Fairly

As we saw in the example, we need to make random decisions when we are generating trees, but we can't always weight all options equally, or the results will be unfair. Lample and Charton remark on this in the paper:

> Naive algorithms (such as... techniques using fixed probabilities for nodes to be leaves, unary, or binary) tend to favor deep trees over broad trees, or left-leaning over right-leaning trees.

In each step of the algorithm, we can reduce the random choices to a single sample: given $$n$$ remaining internal nodes and $$e$$ empty nodes, assign the first $$k$$ nodes as leaves, and assign the next node as either a unary or binary node. The paper summarizes the probability of each choice as:

> $$P(L(e, n)=(k,a))$$ is the probability that the next internal node is in position $$k$$ and has arity[^arity] $$a$$.

[^arity]: Here "arity" is the same thing as node degree; a unary node has arity 1, and a binary node has arity 2. [More on this concept](https://en.wikipedia.org/wiki/Arity).

To calculate this probability, we can enumerate all the possible trees. If the next node is unary, we are assigning one internal node, so $$n-1$$ remain. We are assigning $$k$$ leaves, using up one empty node, and creating another, so the remaining empty nodes are $$e-k$$.

$$P(L(e,n)=(k, \text{unary}))=\frac{\text{number of trees with $n-1$ internal nodes generated from $e-k$ nodes}}{\text{number of trees with $n$ internal nodes generated from $e$ empty nodes}}$$

If the node is binary, the formula is the same, except that we are creating two empty nodes, so $$e-k+1$$ remain.

$$P(L(e,n)=(k, \text{binary}))=\frac{\text{number of trees with $n-1$ internal nodes generated from $e-k+1$ nodes}}{\text{number of trees with $n$ internal nodes generated from $e$ empty nodes}}$$

To save space, we can use the notation:

$$D(e, n)=\text{number of trees with $n$ internal nodes generated from $e$ empty nodes}$$

We can calculate this number recursively using three insights.

1. If there are no more internal nodes to assign, only one tree is possible (the one you already have), so $$D(e,0)=1$$ for all $$e\geq0$$.

2. If there are no empty nodes, no trees can be generated for any remaining internal nodes, so $$D(0,n)=0$$ for all $$n>0$$.

3. For $$e>0$$ and $$n>0$$, there are three possibilities for the first node:

    a. It's a leaf, leaving $$e-1$$ empty nodes and $$n$$ internal nodes.

    b. It's a unary node, leaving $$e$$ empty nodes (one consumed and one produced) and $$n-1$$ internal nodes.

    c. It's a binary node, leaving $$e+1$$ empty nodes (one consumed and two produced) and $$n-1$$ internal nodes.

Overall, insight 3 can be stated:

$$D(e,n)=D(e-1,n)+D(e,n-1)+D(e+1,n-1)$$

Together, these form a recursive expression for $$D(e,n)$$. You can even calculate these values in Excel, if you want! Here's a table of the first 10 values:

![A table of the first 10 values of D(e,n)](/assets/media/integration/excel_table.png)

A table of the first 10 values of $$D(e,n)$$.
{: .img-caption}

![How the addition works.](/assets/media/integration/addition_spreadsheet.png)

How the addition works.
{: .img-caption}

To prevent this calculation taking up too much time, we can [memoize](https://whatthefuck.is/memoization) the function by caching its results (this combo, recursion and memoization, is usually called [Dynamic Programming](https://stackoverflow.blog/2022/01/31/the-complete-beginners-guide-to-dynamic-programming/)).

Now that we have a way to calculate $$D(e,n)$$, we can define:

$$P(L(e,n)=(k,\text{unary})) = \frac{D(e-k, n-1)}{D(e,n)}$$

And:

$$P(L(e,n)=(k,\text{binary})) = \frac{D(e-k+1, n-1)}{D(e,n)}$$

### Implementing in Python

[Here's a link](https://github.com/cckolon/intclass/blob/main/data_generation/generate_functions.py) to the Python module where I did this. I used [Sympy](https://www.sympy.org/en/index.html), a Python CAS, to simplify the functions. To handle memoization, I used the [functools `@cache` decorator](https://docs.Python.org/3/library/functools.html#functools.cache).

## Calculating Integrals Efficiently

Now that I had a big list of random functions, I needed to integrate them symbolically and save them for use in the training set. I decided on a [SQLite](https://www.sqlite.org/index.html) table with the following three columns:

- _Integrand_: The function to be integrated.
- _Integral_: Either the result of integration, or `NULL` if the integration was not successful.
- _Success_: True if integration succeeded, false otherwise.

To do the actual integration, I used Sympy again. Sympy is really special - a free and open-source computer algebra library written in pure Python. The following block of code can integrate lots of really complex functions!

```python
import sympy as sp

def integrate_function(f: str) -> str:
    integral = sp.integrate(f, sp.symbols('x'))
    return str(integral)
```

Sympy does have some weaknesses, though. Python isn't the most performant language (though [it's getting better!](https://www.youtube.com/watch?v=wyty6sFMWI0)), so integrating with Sympy can be slow. Integration also hangs sometimes (this behavior is common to most computer algebra systems).

To solve the performance issue, I wanted to perform integrations in parallel. To solve the hanging issue, I wanted to implement a timeout (something also done by the authors of the paper).

### Python Parallelism

Implementing parallelism in Python is tricky, because of the [Global Interpreter Lock](https://docs.Python.org/3/c-api/init.html#thread-state-and-the-global-interpreter-lock), or GIL. The GIL exists because the Python interpreter is not fully [thread-safe](https://en.wikipedia.org/wiki/Thread_safety). Essentially it means that only one thread can access Python objects at one time. There are [lots of opinions](https://news.ycombinator.com/item?id=36915511) about the GIL, but [PEP 703](https://peps.python.org/pep-0703/) says it best:

> The GIL is a major obstacle to concurrency.

Because of this, Python has multiple built-in approaches to concurrency - some which simulate parallelism, and some which actually achieve it at a cost. When writing parallel Python code, understanding the differences between these approaches can help you understand what will _actually_ speed your code up.

- [`threading`](https://docs.python.org/3/library/threading.html) is a module which allows multiple [threads](https://en.wikipedia.org/wiki/Thread_(computing)) to execute tasks concurrently within the same interpreter. If code is I/O-bound (that is, it spends most of its time waiting for external events, like networking or APIs to other code), threading is well-suited, since threads won't often try to access the same objects at once. If, on the other hand, the long-running tasks involve manipulating Python objects or are CPU-bound, the GIL will prevent simultaneous
- [`asyncio`](https://docs.python.org/3/library/asyncio.html) is a module which allows _simulated concurrency_ on the same thread. Tasks run in an [event loop](https://en.wikipedia.org/wiki/Event_loop), and when one task is waiting for network or disk operations, the interpreter switches to another task and works on it. Again, this is good for I/O-bound code (it's great for web servers). It also is simpler than multithreading and more intuitive for people with async experience in other languages ([like JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Introducing)). A common cliche is that you should "use asyncio when you can, and use threading when you must." Unfortunately it suffers from a similar limitation to threading: if one task is executing Python code it will block the event loop.
- [`multiprocessing`](https://docs.python.org/3/library/multiprocessing.html) is a different approach where multiple Python interpreters are spawned in different [processes](https://en.wikipedia.org/wiki/Process_(computing)). This allows _true concurrency_ because each process has its own GIL. The processes generally run on separate CPU cores, so the number of processes is limited by your hardware, and [sharing state between processes](https://docs.python.org/3/library/multiprocessing.html#sharing-state-between-processes) is [tricky](https://peps.python.org/pep-0703/#multiprocessing).

In this case, the long-running tasks were all happening in Sympy, a pure-Python program, and had no I/O component. This led me to believe that threading or asyncio would not speed things up meaningfully. Multiprocessing, on the other hand, could make things much faster. My desktop computer has 16 cores, so potentially I could speed the program up 16 times! To run the processes, I used [`concurrent.futures`](https://docs.python.org/3/library/concurrent.futures.html), which provides some high-level tools to run processes without needing to worry too much about cleanup. Here's a basic sketch of how to do this:

```python
def integrate_functions_parallel(functions: list[str]) -> list[str]:
    with ProcessPoolExecutor() as executor:
        results = list(
            executor.map(
                integrate_function,
                functions,
            )
        )
        return results
```

### Time's Up!

This solves the parallelism issue, but it does nothing about the hanging issue. If a function takes a long time to integrate, it can clog up the whole process! Over time, I was worried that almost all of the computer's time would be wasted on slow integrals (which would probably never compute).

![In this example, slow integrals dominate over fast ones, even though there are many more fast ones.](/assets/media/integration/fast_and_slow_processes.png)

In this example, slow integrals dominate over fast ones, even though there are many more fast ones.
{: .img-caption}

So I chose to make processes time out with the [wrapt timeout decorator](https://pypi.org/project/wrapt-timeout-decorator/). Because I was concerned about integration processes hogging all the computation time, I used the [signals strategy](https://pypi.org/project/wrapt-timeout-decorator/#signals-strategy). The timeout would raise an exception if any process took longer than a specified time. If this happened, I would catch the exception and count the integration as failed.

```python
@timeout(INTEGRATION_TIMEOUT, use_signals=True)
def integrate(f: str) -> str:
    integral = sp.integrate(f, sp.symbols(INTEGRATION_VARIABLE_NAME))
    if integral.has(sp.Integral):
        raise IncompleteIntegralException(
            f"Could not fully integrate {f}"
        )
    return str(integral)

def integrate_function_with_timeout(f: str, timeout: int) -> tuple:
    start_time = time()
    try:
        integral = integrate(f)
        return (f, integral, True)
    except Exception as e:  # incomplete integration can raise a lot of exceptions, so I used the general catch here
        return (f, None, False)
```

### Pesky Processes

When I ran these functions, though, I was surprised to see that performance barely went up! 


## References and Footnotes
