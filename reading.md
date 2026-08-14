---
layout: default
title: Reading
image: /assets/media/carl_reading.webp
image_width: 1360
image_height: 1389
description: Carl Kolon's favorite articles about programming.
keywords: programming, reading, articles, professional development
---

# Carl's Required Reading

As an engineering leader, I often send articles to my team, which I jokingly call "required reading". My goal is to help us digest some of the wisdom of other programmers who have probably faced challenges similar to ours. By popular demand, I'm putting the list here for anyone else interested!

Most articles are on this list because they make a point that I think is important or insightful about how to create good software. Some of the points in here reinforce my opinions about certain things (for example, ORMs are bad, and frontends should be simple). You may disagree! But at least you will hopefully get something valuable out of the article, even if it is that you feel the opposite way.

These articles are technical, and if you are not a programmer you will probably not find them interesting.

This list may be a little overwhelming, so I have annotated my favorite articles with a star. I have also written a brief summary of why I think each article is important.

## Coding practices

### ⭐ [The Grug Brained Developer](https://grugbrain.dev/)
If I could recommend only one article to new and experienced programmers alike, this would be it. Complexity bad.

### [The Wrong Abstraction](https://sandimetz.com/blog/2016/1/20/the-wrong-abstraction)
It's really tempting to see code duplication and immediately rush to eliminate it by consolidating it somewhere. This essay is adapted from [a 2014 talk](https://www.youtube.com/watch?v=8bZh5LMaSmE) about factoring object-oriented code and talks about situations where this may not be appropriate. You need to understand this to effectively push back against coding agents which are motivated to create a "single source of truth" everywhere.

### [Complexity Budget](https://htmx.org/essays/complexity-budget/)
When projects get too complex, progress seems to stop very suddenly. This essay is about understanding this phenomenon and trying to forestall it as long as possible.

### [Locality of Behavior](https://htmx.org/essays/locality-of-behaviour/)
Programmers (and coding agents) often try to achieve Separation of Concerns (SoC) or eliminate code reuse by creating numerous helper functions. There's a tradeoff between this and Locality of Behavior, a principle which encourages us to make the behavior of code as obvious as possible when looking only at that one unit.

### [Yagni](https://martinfowler.com/bliki/Yagni.html)
Creating speculative features with the future in mind is basically always a bad idea.

### [Parse, Don't Validate](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/)
This one takes a little work to understand, but the basic idea is that if you ensure that a piece of data has a certain property, you should encode that property directly in the object's type. This will cause code changes that break the assertion to throw type errors at compile time, rather than value errors at runtime.

## Platform

### ⭐ [Steve Yegge's Google Platforms Rant](https://gist.github.com/chitchcock/1281611)
There is a ton of really good stuff in here, especially about accessibility and setting up software organizations. I do not recommend every company enforce the Bezos mandate, but you should think critically about whether you can expose your service's features to other teams in a programmatic way. It's also just fun to read.

## Frontend 

### ⭐ [HATEOAS](https://htmx.org/essays/hateoas/)
In web applications, state is often encoded and stored separately from both the frontend markup and the backend (for example, with React's `useState`). Often, it makes more sense for state and the user's allowed actions to be directly stored in and derived from the html served to the user. This is tightly related to the original concept of a REST API (most modern "REST" APIs [do not actually follow the REST constraints](https://htmx.org/essays/how-did-rest-come-to-mean-the-opposite-of-rest/)). I have also written briefly about HATEOAS [on my own site](https://carlkolon.com/2026/01/27/jfmm-semantic-search/#hateoas).

### [Components and Hooks must be pure](https://react.dev/reference/rules/components-and-hooks-must-be-pure)
The biggest problem I see when people move from writing backend code to writing React is that they try to write the frontend _imperatively_. That is, they try to tell the computer what to do, line by line. This typically involves the overuse of state and side effects, common in object-oriented programming. Instead, the frontend should be _declarative_. That is, you should tell the computer _what you want to get back_. To support this, (modern) React is designed around a functional programming style. Every component is a function, and state and side effects are avoided except for where they are truly necessary, in which case hooks are required. I recommend reading all the React docs, but if you just want to focus on one, this is the best.

### [Understanding useMemo and useCallback](https://www.joshwcomeau.com/react/usememo-and-usecallback/)
`useMemo` and `useCallback` are the most misused hooks in React (besides maybe `useEffect`), and both agents and humans love to throw them in everywhere. This article is a guide to where they are actually necessary.

### [Hypermedia Systems---Components of a Hypermedia System](https://hypermedia.systems/components-of-a-hypermedia-system/)
If you want to write a good frontend, it is very valuable to understand the model around which HTML is based. This is a great chapter of a great book which will help you maximize your use of the browser's design, rather than seeing HTML as "an awkward, legacy markup language that must be grudgingly used to build user interfaces in what are increasingly entirely JavaScript-based web applications."

## Databases

### ⭐ [The Vietnam of Computer Science](https://www.odbms.org/wp-content/uploads/2013/11/031.01-Neward-The-Vietnam-of-Computer-Science-June-2006.pdf)
I am a certified ORM-hater. I think they are seductive for new projects, but quickly begin to cause performance issues and confusion. As an example, see this [OpenAI article](https://openai.com/index/scaling-postgresql/) about scaling Postgres:

> Many of these problematic queries are generated by Object-Relational Mapping frameworks (ORMs), so it’s important to carefully review the SQL they produce and ensure it behaves as expected.

This is the best essay against ORMs that I have read and, even though it's long, I recommend it highly.

### [Wikipedia---The Object-Relational Impedence Mismatch](https://en.wikipedia.org/wiki/Object%E2%80%93relational_impedance_mismatch)
Some more ammo in my anti-ORM crusade. This is more technical but more succinct, so if you're just looking for the bullet points I'd read this.

### [Introduction to PostGIS---Geography](https://postgis.net/workshops/postgis-intro/geography.html)
PostGIS (and geospatial databases) require a little getting used to. It's good to understand the new data types you're working with when you build a map-based data visualizer. PostGIS is a great database and its foundational data type is `geography`[^geography-datatype].

[^geography-datatype]: This is actually not correct, as [seabre pointed out](https://news.ycombinator.com/item?id=49217184) on Hacker News. The foundational data type in PostGIS is `geometry`, which you can read about [here](https://postgis.net/workshops/postgis-intro/geometries.html). It's still good to learn about `geography` though, and the intro page is a little more accessible.

### [Postgres Docs Chapter 14---Performance Tips](https://www.postgresql.org/docs/current/performance-tips.html)
This is a great article to _have read_ when your database starts slowing down. Knowing how to use `EXPLAIN` and `EXPLAIN ANALYZE` is on par with knowing how to use a debugger, in my opinion.

### [Paging Through Results](https://use-the-index-luke.com/sql/partial-results/fetch-next-page)
Most people use `LIMIT` and `OFFSET` when building pagination systems. If you are paginating through a lot of data, these get slow (especially when loading high-number pages). This is a good overview of some other options to get around this problem. I also talk about this [on my site](https://carlkolon.com/2026/01/27/jfmm-semantic-search/#pagination).

## Asynchronous programming

### [A Conceptual Overview of asyncio](https://docs.python.org/3/howto/a-conceptual-overview-of-asyncio.html)
Many people are just thrust into async programming and don't really understand what's going on, but learn it as they go. Often this leads to embarrassingly basic asyncio mistakes like making blocking calls inside async functions. This is a good article from the docs which should make it clearer what asyncio is doing under the hood, and therefore teach you how to use it best.

### [What Color is your Function?](https://journal.stuffwithstuff.com/2015/02/01/what-color-is-your-function/)
Bob Nystrom is one of my favorite programming authors. This is an example of how async programming systems often have fundamental flaws. There's not much you can do (besides use a different language) but this will at least teach you that some of the async programming limitations that you hit are fundamental, and not just a skill issue.

## Encoding

### [The Absolute Minimum Every Software Developer Absolutely, Positively Must Know About Unicode and Character Sets (No Excuses!)](https://www.joelonsoftware.com/2003/10/08/the-absolute-minimum-every-software-developer-absolutely-positively-must-know-about-unicode-and-character-sets-no-excuses/)
Reading this earlier in my career would have saved me hundreds of hours incorrectly parsing data collected from the internet.

## Books

These books have shaped the way that I feel about programming, design, and managing software projects.

### The Design of Everyday Things ([Amazon](https://www.amazon.com/Design-Everyday-Things-Revised-Expanded/dp/0465050654))

Lots of people seem to think that "design" means making things look pretty. Really, design is about anticipating the needs of your user and making your product fulfill those needs as well as possible. Often this second meaning of design runs contrary to the first, and in these cases you should choose the second. The early example of "Norman Doors" in the book is a great illustration of this, along with the wry observation that the doors "probably won a design prize" even though the author can't figure out how they work.

### Designing Data-Intensive Applications ([O'Reilly](https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/)) ([Amazon](https://www.amazon.com/Designing-Data-Intensive-Applications-Reliable-Maintainable/dp/1098119061))

Liking this book is such a meme, but it actually is really great. It's also one of the few programming books that works well via audiobook. My favorite chapters are 7 (Transactions) and 10 (Batch Processing). While some may disagree, I think this is a great introduction to databases too, and makes you think hard about what you actually want to optimize in your data system (even if you are not serving a zillion users).

### Crafting Interpreters ([free online](https://craftinginterpreters.com/))

This is a great, encouraging, fun book which teaches you how to build an interpreter, first in Java for simplicity and then in C for performance. While you can read along and write the Java code directly, I think it's even better to try implementing the interpreter in another language of your choice, so you have to engage your brain more. [I used rust](https://github.com/cckolon/rlox).

### Category Theory for Programmers ([free online](https://bartoszmilewski.com/2014/10/28/category-theory-for-programmers-the-preface/)) ([order hardcover](https://www.blurb.com/b/9621951-category-theory-for-programmers-new-edition-hardco?srsltid=AfmBOorML0osX9pBLA7bSJCjMebmXrBVUktX6803wMuRKoSmBMO4n8Jf))
 
While this book is a little hardcore, it's the best intro to category theory that I've seen (though if you're a fan of rigor, you may want to google some of the formal definitions yourself). Read this if you want to write good functional code while also flexing on your coworkers by using words like "functor" and "monad".

### The Mythical Man-Month ([Amazon](https://www.amazon.com/Mythical-Man-Month-Software-Engineering-Anniversary/dp/0201835959))

This book was published in 1975 (!!) and revised most recently in 1995, but it is still incredibly relevant. In fact, as programmers become armed with AI tools, some of the chapters (like chapter 4, Aristocracy and Democracy in System Design) seem more applicable now than they were in 1995. Read this if you want to manage a programming project and have it succeed.

## Footnotes