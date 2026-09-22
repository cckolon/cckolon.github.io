---
layout: post
title: It's Hard to Learn from Machines
image: /assets/media/learning-from-machines/lee-sedol-vs-alphago-game-4.webp
image_width: 557
image_height: 614
description: Superhuman programs won't teach you to be superhuman.
keywords: AlphaGo, Go, chess, reinforcement learning, interpretability, LLMs, heuristics, value network, Lee Sedol
---

Teaching Go or chess involves lots of heuristics or proverbs that are learned from years of experience: "knights on the rim are grim," "hane at the head of two stones," etc. Opening theory in both games consists entirely of memorized moves. Almost like a materialized view in a database, these principles would be too expensive to figure out at game time, so they must be stored, even though they are more complex than the essential rules of the game itself.

AI has these too. The value network in AlphaGo assigns "goodness" to board positions based entirely on learned weights. In a sense this network is made of heuristics. Unfortunately it is hard to learn good play from the weights of the value network itself because machines and people have different notions of simplicity. Instead we have to watch what the machines do and try to distill their actions into rules that make sense to us. This works to some extent (early 3-3 invasion is an example) but it's much weaker than learning the principles directly from a teacher.

![AlphaGo v Lee Sedol game 4. Image by Wesalius via Wikimedia Commons, CC BY-SA 4.0.](/assets/media/learning-from-machines/lee-sedol-vs-alphago-game-4.webp){: width="557" height="614"}
Game 4 of Lee Sedol vs AlphaGo, the only game Lee won.
{: .img-caption}

In "[Human Learning from Artificial Intelligence: Evidence from Human Go Players' Decisions after AlphaGo](https://escholarship.org/uc/item/6q05n7pz)" (2021), Shin, Kim & Kim show that human play has improved since AlphaGo, but only before move 50. We can memorize AI moves, but we can't internalize or understand what's behind their decisions.

You can ask an LLM why AlphaGo did something, but this is obviously silly. How could the LLM know?

Now imagine that the LLM itself underwent RL on the game of Go. It seems that you could then ask it why it made a certain move and get a good answer, but why should we expect this? What makes you think its heuristics are explainable to you? Probably it would say _something_ plausible, but that might not be what it was "thinking" when it made the original move. It was posttrained to choose good moves, but not to explain those moves to people (a much less verifiable task).

Unfortunately I think this logic extends to other tasks learned with RL.
