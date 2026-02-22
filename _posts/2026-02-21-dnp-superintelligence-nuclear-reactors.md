---
layout: post
title: Tuning Semantic Search on JFMM.net
image: /assets/media/jfmm/embedding.webp
image_width: 2164
image_height: 1036
description: What delayed neutron precursors can teach us about the probability of a fast takeoff.
---

The release of the newest generation of coding models has many people thinking about recursive self-improvement. In Nick Bostrom’s “fast takeoff” scenario, AI agents become superhuman AI researchers, and create superintelligence in a matter of hours or days. This is bad, or at least risky, because humans wouldn’t have time to learn how to control superintelligent AI as it develops. 

A much better path would be a slow takeoff, in which AI capabilities improve at a pace at which humans can adapt. Though, even on a longer time scale, alignment is proving to be very tricky. 

Nuclear reactor designers faced a similar problem in the 1940s and 1950s. Reactor power increases exponentially based on the reactivity of the core. If the core of a reactor produces $$n$$ neutrons in generation 1, it will produce $$k_\text{eff}\times n$$ neutrons in generation 2, where $$k_\text{eff}$$ is a constant called the _effective multiplication factor_.

| When                 | the reactor is    |
|----------------------|-------------------|
| $$k_\text{eff} < 1$$ | subcritical       |
| $$k_\text{eff} = 1$$ | critical          |
| $$k_\text{eff} > 1$$ | supercritical     |

If we assume that the length of a neutron generation is some number called $$\ell$$, we can approximate the reactor's power at some time in the future by:

$$ P(t) \approx P(0)\, (k_\text{eff})^{t/\ell}$$

