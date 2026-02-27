---
layout: post
title: 747s and Coding Agents
image: /assets/media/747/variable-stator-vanes.webp
image_width: 659
image_height: 465
description: Comparing a career flying the 747 and a career coding with AI assistance.
keywords: coding agents, AI, software engineering, LLM, programming, skill development, career, Boeing 747, aviation, machine learning
---

A couple years ago, I was on the way back from a work trip to Germany. I had been upgraded to business class, and I sat next to a Belgian 747 pilot, probably in his fifties or sixties. We talked a fair bit about our careers. I had left the Navy and started professionally programming less than a year before. He had been a pilot since shortly after graduating university, and had flown the 747 for about twenty years. He had studied mechanical engineering at school, and he told me in great depth about the variable geometry jet turbines in modern aircraft, which could remain efficient across a wide altitude range.

![Variable stator vanes in a modern jet engine](/assets/media/747/variable-stator-vanes.webp){: width="659" height="465"}

I expressed some jealousy about how well suited he was to his job. Clearly he was a geek for aircraft, and even though most airlines don’t fly the 747 anymore, it is an incredible machine. He agreed that it was a privilege to fly the plane, but said wistfully:

> In this job, after a while, there’s no improvement. You are no better today than you were yesterday.

He said that by now, he knew the 747 about as well as a pilot could. In fact, he sometimes wished he had become an engineer or designer of airplanes, so that he could learn new things as a core part of his job. Then he said:

> You are lucky that your job is like that.

Since that flight, my job has changed a great deal. Coding agents can do a large portion of what I previously considered my work. I’m one of the last people who should be upset about this, since I work at an AI lab and stand to gain a great deal if AI follows through on its economic promise. Still, it has changed how I solve problems, and at times I feel more like a pilot than an engineer.

In the past, when I fixed a bug or implemented a feature, I would have to spend a minimum amount of effort understanding the situation. For example, to add pagination to this website, I would read the [Jekyll docs](https://jekyllrb.com/docs/pagination/), find the right [plugin](https://github.com/sverrirs/jekyll-paginate-v2) to install, read the [sample config](https://github.com/sverrirs/jekyll-paginate-v2/blob/master/README-GENERATOR.md#site-configuration), and make the change. Possibly this wouldn’t work, in which case I would Google it, read more, try more stuff, retest, etc. In this process it was hard not to learn things. I would walk away from the problem with a better understanding of how the system worked. If I had to implement the feature again, I would be able to do it faster and more easily.

Once LLMs started getting good at coding, I would occasionally ask them for help at the beginning of this process, mostly replacing search engines. If I hit an error, I would copy and paste it into a chatbot to see what it said before trying hard to understand it (often, before reading it). This didn’t replace critical thinking, though, since I would still need to learn and plan to implement the change.

With the AI coding agents of the last few months, though, things are different. Often the agent can implement a whole feature end-to-end, with no involvement from me. Now when I need to make a change to the codebase, I don’t start by trying to understand. Instead, I see if my coding agent can “one-shot” the problem, and only step in if it seems to be failing. This happens less and less, and the features that I trust agents with have become bigger and bigger.

I believe in coding primarily as a means to an end. Coding agents have allowed me to do much more than before, so for the most part I am happy with them! But I'll admit there is also something bothersome about turning features over to AI fully.

![my productivity over the last couple years in github commits](/assets/media/747/more-productive.webp){: width="900" height="473"}

I do not build skills or knowledge as quickly this way. If I build a feature with a coding agent and then have to do it again, I won’t be any faster the second time. It’s possible to imagine writing code with AI for twenty years and not being much more skillful at the end of it. There's no improvement.

If I do have to step in and save the LLM, I often become lost as well. All of a sudden, I am reading someone else’s code. Rather than gradually coming to terms with a solution to a problem, I am presented with the solution wholesale---only, it’s a little bit wrong. As LLMs handle bigger tasks for me, this gets worse. My only saving grace is that I will do it less often.

You might say that the new, real skill is [prompting agents](https://www.forbes.com/sites/rodgerdeanduncan/2025/10/16/prompting-the-21st-century-skill-that-will-change-how-we-work/) ([archived](https://archive.ph/t4y24)), but I don’t believe that. Prompting is easy and [will only get easier](https://www.oneusefulthing.org/p/a-guide-to-prompting-ai-for-what). Hard knowledge about programming and the problem is what helps you make good design decisions, so this knowledge is the most important factor determining whether your coding agents are successful. Developing this knowledge is becoming optional.

Some people will probably respond to this by saying (snottily) that I should read the code that my agents produce, rather than rely on them blindly. I do read the code, but reviewing code is very different from producing it, and surely teaches you less. If you don’t believe this, I doubt you work in software.

Coding agents are here to stay, and you’re a fool if you don’t use them. Still, I think you’ll use them most successfully if you understand the domain in which you’re working. This used to be an essential byproduct of programming, but that's not the case anymore. To this end, maybe it’s a good idea to write a minimum amount of code by hand as an educational task, rather than a productive one, or to try to write the solution to a problem yourself, and only compare with the LLM once you’re confident your answer is correct.