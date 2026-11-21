---
layout: post
title: Careers in the Age of AI
image: /assets/media/ai-capabilities/human_frontier_meta.png
image_width: 1200
image_height: 630
description: What should you focus on to have a successful career in the presence of powerful AI?
keywords: AI, careers, automation, jagged frontier, Moravec's paradox, Gödel Escher Bach, Hofstadter, future of work, artificial general intelligence, labor economics
---


Suppose you're a new graduate of college and you're picking a career. Or suppose you already have a career and you're thinking about what to focus on. How should you make that decision?

When you make long-term career decisions, you are betting on the future of the economy. You want to work in an area that is highly valued, so it is important to consider what will be highly valued in the future. AI has changed this already, and promises to change it further. Therefore career decisions are, in some sense, bets on the future of AI capabilities. To have a successful career you should focus on tasks that you think AI is unlikely to automate soon.

To be clear, I think it is most likely that AI will become superhuman at all economically valuable tasks in the near future. Once this is the case, it will be possible to completely substitute capital for labor, meaning that the sole determinant of someone's impact on the world will be how much money they have. [Rudolf Laine explores this concept in detail here](https://www.nosetgauge.com/p/capital-agi-and-human-ambition). This idea is known in popular culture as the [permanent underclass](https://www.nytimes.com/2026/04/30/opinion/ai-labor-work-force-silicon-valley.html), referring to the people with less money who will be excluded from success. In a future like this, people might find non-economic ways to amuse themselves, resembling the [status games that people already play](https://asteriskmag.substack.com/p/we-already-know-what-a-world-without) when they do not participate in the economy.

If you are ambitious, you probably find this future bleak. While this alone isn't a reason to discount it, it's worth asking whether there are other possibilities. What would work look like if this doesn't happen? Where should you focus your time? It is possible that AI capabilities might stall, as they have in the past. If such a stall does happen, the remaining work will become much more valuable. As an example, in 1880, 51% of Americans were employed in agricultural work. Today it is less than 2%, largely because of automation. This did not result in mass unemployment; instead, the economy expanded to the point where there were enough new jobs to support people who were previously automated out of agricultural work[^export-import].

[^export-import]: You might argue that these jobs were shifted to the developing world, but while the US is a [net importer of farmed goods by dollar value](https://ers.usda.gov/data-products/chart-gallery/58310), we are a [net exporter of calories](https://arxiv.org/pdf/2411.18856). Also, the [same trend of fewer people working in agriculture holds worldwide](https://ourworldindata.org/grapher/share-of-employment-in-agriculture) (though to a less dramatic extent). Clearly automation is the driving factor here.

![Share of the US workforce in agriculture, 1880-2025](/assets/media/ai-capabilities/us_agri_share_1880_2025.svg)
A graph of the share of the US workforce engaged in agriculture from 1880--2025[^agriculture-stats]
{: .img-caption}

[^agriculture-stats]: Statistics before 1948 count people age 10 and over, while after 1948 they count employed civilians age 16 and over. The drop between 1999 and 2000 partly reflects [a BLS change in how industries are classified](https://www.bls.gov/cps/cpsoccind.htm). Sources: [Lebergott (1966)](https://www.nber.org/system/files/chapters/c1567/c1567.pdf), 1880–1940; [BLS Current Population Survey](https://www.bls.gov/cps/cpsaat01.htm) annual averages, 1948–2025.

If AI stalls at a certain capability level, most people should be able to find gainful employment doing the remaining set of unautomatable tasks. What might those be?

## Levels of signals

_Gödel, Escher, Bach_ is a wonderfully prescient and compelling book, and its ideas are remarkably relevant to modern AI. Take for example Douglas Hofstadter's description of the "Grandmother Cell":

> Because of the discovery of cells in the visual cortex which can be triggered by stimuli of ever-increasing complexity, some people have wondered if things are not leading in the direction of "one cell, one concept"---for example, you would have a "grandmother cell" which would fire if, and only if, your grandmother came into view.

Compare this with [Golden Gate Claude](https://www.anthropic.com/research/golden-gate-claude):

> We found that there’s a specific combination of neurons in Claude’s neural network that activates when it encounters a mention (or a picture) of this most famous San Francisco landmark.

> Not only can we identify these features, we can tune the strength of their activation up or down, and identify corresponding changes in Claude’s behavior.

It is hard to believe that these passages are over 40 years apart!

In _Ant Fugue_, Hofstadter discusses a conscious ant colony named "Aunt Hillary" who is paradoxically friends with an anteater. The anteater is explaining how higher level thoughts arise from the primitive behavior of the ants.

> _Anteater_: All right. Let's begin at the bottom. When ants need to get something done, they form little "teams", which stick together to perform a chore. As I mentioned earlier, small groups of ants are constantly forming and unforming. Those which actually exist for a while are the teams, and the reason they don't fall apart is that there really is something for them to do.

> ...

> _Achilles_: I see. I assume that these "teams" are one of the levels of structure falling somewhere in between the single-ant level and the colony level.

> _Anteater_: Precisely. There exists a special kind of team, which I call a "signal"---and all the higher levels of structure are based on signals. In fact, all the higher entities are collections of signals acting in concert. There are teams on higher levels whose members are not ants, but teams on lower levels. Eventually you reach the lowest-level teams---which is to say, signals---and below them, ants.

This is an analogy for how conscious thought could arise in humans, with simple neurons forming the lowest level and conscious reasoning forming the highest level. A similar theory could explain modern AI systems, with matrix multiplications of weights and biases on the lowest level, and emergent intelligent behavior on the highest level.

![Stacks describing how low-level behavior becomes high-level behavior in Aunt Hillary, humans, and AI](/assets/media/ai-capabilities/symbol_stacks.svg)

Neural network internals are almost as difficult to study as the human mind. We can model the bottom level exactly, and we can observe the top level by interacting with the models directly, but understanding the middle layers is really hard. While [Anthropic is leading the field](https://transformer-circuits.pub/), there is a long way left to go before this research catches up with AI capabilities.

## Levels of capability

LLMs can only interact with the world by generating tokens, so in some sense all of their interactions with us, tools, the internet, and each other happen at the top level of abstraction. Humans, on the other hand, can interact with our environment in many different ways, and these ways seem to split off at different levels, some far below the level of conscious thought.

A low level human behavior would be something like an involuntary reflex. Many reflexes can be understood completely mechanistically, at the level of individual neurons in the spinal cord. Involuntary things like our heartbeats and breathing patterns are not quite this simple, but we still understand them on the level of neurons and signaling chemicals.

Mid-level human behaviors might include things like walking, grasping things, or finding our way around. In a sense we know least about these phenomena, because they are too complex to understand at the neuron level, but too basic to understand through introspection.

High-level human behaviors include the things that we think of as intelligence: empathizing with people, coming up with ideas, solving math problems. But even among these high-level behaviors there is a clear hierarchy. At the highest levels of abstraction it is easy to understand what we are doing: for example, I can explain to you how to solve a quadratic equation, or how to write a python function. But there are intermediate-high levels where the inner workings of our brains are less accessible. Can I explain how to come up with a joke, how to appreciate music, how to write convincingly? Maybe in some sense, but it's harder.

![Human capabilities, ordered by abstraction](/assets/media/ai-capabilities/human_stack.svg)

We typically think of the highest-level behaviors as requiring the most intelligence or education. It has been surprising, then, to see AI master these first. Why has this happened?

## The jagged frontier

This phenomenon is often described as a [jagged frontier](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4573321) (also known as [jagged intelligence](https://x.com/karpathy/status/1816531576228053133?lang=en) or [spiky intelligence](https://www.exponentialview.co/p/we-are-all-spiky)). AI systems have become very good at some "hard" tasks like chess, math, and competitive programming, but lag behind humans in "easy" tasks like using a web browser, finding their way around visually, or seeing a task through from beginning to end.

![An image illustrating the jagged frontier concept](/assets/media/ai-capabilities/spiky_frontier_pueyo.jpeg)
Image from [Tomas Pueyo on X](https://x.com/tomaspueyo/status/1993360931267473662/photo/1).
{: .img-caption}

In this picture, the frontier of human intelligence is depicted as a circle. The ease of a task is considered entirely from a human point of view. In reality, human intelligence itself is very spiky. Human behaviors like grasping, walking, and speech are very complex from any objective standpoint; they require coordinated operation of many systems in the body, common sense, fuzzy recognition, and other capabilities that have been hard to develop in computers. Multiplication is trivial from an information-theoretic point of view. Yet humans learn to walk, talk, and pick things up long before they are ready to learn multiplication. Hans Moravec remarks on this in _Mind Children_:

> It is comparatively easy to make computers exhibit adult level performance on intelligence tests or playing checkers, and difficult or impossible to give them the skills of a one-year-old when it comes to perception and mobility.

The spikes in human intelligence are probably _actually_ hard, but humans are good at them because were programmed into our brains through evolution at a low level. This also means they are not as accessible to our conscious minds, and we are blind to their difficulty, so our intuition about which tasks are hard can be very wrong.

![An xkcd comic making the point that it is very difficult to estimate the difficulty of computer science tasks.](https://imgs.xkcd.com/comics/tasks_2x.png){: width="300" height="503"}

Image from [xkcd](https://xkcd.com/1425/). Ironically this example is a little dated.
{: .img-caption}

With this in mind, the progression of machine intelligence makes a lot more sense! Of course machines mastered chess before reaching human performance at tasks which we evolved to do. When we redraw the image, inverting the perspective of human and machine, the future seems more ambiguous.

![The same image, with human intelligence displayed as jagged](/assets/media/ai-capabilities/human_frontier_inverted.svg)

## Where are the spikes?

What human advantages will be most resistant to change? Many people have opined here, [particularly VCs](https://conversationswithtyler.com/episodes/peter-thiel-political-theology/). I guess this makes sense because they think a lot about the future of the economy.

Physical jobs seem safer than purely intellectual ones, since robotics has not progressed as quickly as language AI. Even in knowledge work, some jobs seem safer than others; sales, for example, has been harder to automate than engineering, because people don't like talking to chatbots or reading their output[^sales-machines]. Many [jobs that require some sort of "taste"](https://paulgraham.com/taste.html) seem to be more resilient. Marc Andreessen says that [VC may be one of the last remaining jobs](https://a16z.com/podcast/how-andreessen-horowitz-disrupted-vc-whats-coming-next/) because it requires a human touch (I find this less convincing).

[^sales-machines]: This may change as machines start making more purchasing decisions than humans.

These people are all describing lower-level, less abstract, more instinctual work. The rising value of tasks like this is already clear in the workplace. When I read the business logic of a program, it's not obvious to me anymore whether it was written by a human or by AI, but if I use the interface I can often sense whether a human's care has gone into it. I never correct Claude about the logical correctness of the code it writes, but I often correct it based on things I sense: will this irritate the user? Does this design look or feel clunky? Where is load time acceptible versus frustrating? How will this feature affect an organization composed of people? Already, the primary value I bring to my company comes from empathy with humans who use the product, rather than the semantics of a programming language. Luckily for me, I evolved to be empathetic!

In an economic future where we compete with machines, we should exploit our comparative advantage in the tasks that are closer to our low-level programming. If AI does not swallow every task, the remaining human tasks will require instinctual skills like empathy, physical action, or prediction of human behavior.

## Footnotes