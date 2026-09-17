---
title: What's wrong with CV research? Thoughts after attending ECCV 2026
date: 2026-09-16
summary: Notes on the frustration in the air at ECCV, what increasingly capable foundation models mean for traditional CV research, and how junior PhD students might choose problems that still matter.
tags: [research, conferences, phd life]
featured: false
author: Letian Wang
---

Earlier, quite a few people who attended CVPR told me they came away pretty disappointed — including some extremely senior people in the field. At the time, I didn't fully understand why. But after I attended ECCV, I finally did.

There was a surprising amount of frustration at the conference, especially since it happened right after the GPT-6 release. People were openly wondering what traditional CV research is going to look like from here, and how much of it will eventually just be absorbed by large foundation models.

Actually, when I gave talks about GenCeption to a few academic groups, I had already started to see that kind of frustration.  
GenCeption essentially leverages a large-scale pretrained diffusion model to build a single unified model that can match — and often outperform — specialized SOTA models across a surprisingly broad range of vision tasks, including DepthAnything3, D4RT, VGGT Omega, SAM3, Genmo, Lotus-2, and others. (The code is now open-sourced! [genception.github.io](https://genception.github.io/))  
Quite a few PhD students told me the work made them question the direction of their own research.

Part of me was happy, because it meant GenCeption had genuinely changed how some people thought about the problem. But that feeling was quickly outweighed by how much I felt bad and empathized with the junior PhD students. Some of them seemed genuinely unsure where to go next, especially when years of work on specialized architectures or training recipes could potentially be absorbed by a sufficiently capable general pretrained model. GPT-6 seems to be just creating that same feeling on a much broader scale.  
It reminds me a lot of what happened with GPT-1 and BERT — tons of NLP PhDs' years of work and entire research directions perish overnight.

There were even some pretty spicy takes floating around: "CV conferences are dead," "academia is becoming disconnected from where some of the most important progress is actually happening," "with increasingly noisy review systems and declining review quality, rejection sometimes is almost a signal of truly fundamental work," and "conferences increasingly reward work delicately engineered around established topics or methodologies, rather than work truly at the frontier." Maybe it's too harsh and too absolute, but the frustration behind them was definitely real.

Conferences used to feel so fruitful, but this time it was hard to get genuinely excited. A lot of papers seemed to solve problems that no longer felt that important, or make progress that felt increasingly incremental. In the era of paper inflation, most people are busy trying to survive the research game, rather than thinking about how to go big after one or two years of diving deep into something. Most valuable skills such as critical thinking and taste never get trained well enough, from the beginning, all the way to the end.  
On the other hand, most people simply don't have enough context or a big enough picture about what problem actually matters. They get stuck optimizing for local problems that their immediate environment tells them are important. I suffered from this for a long time too, but luckily I gradually started to see a much bigger picture.

My advice to junior PhD students is: when you start a project, try to collect as much context as possible before you even begin — by all means.

One way is to explore the boundaries of existing models as aggressively as you can. Play with the SOTA models extensively. Keep throwing harder and harder problems at them until they fundamentally break. Understand not just what they can do today, but where their capabilities end and why.  
Another way is to put yourself wherever the strongest signals are. That could be a visionary academic lab, a team at an industry frontier lab, a genuinely insightful seminar, or simply a senior student or researcher who has seen a much broader landscape than you have. Expand your local context as much as possible.

In an era where things are moving this fast, the information gap alone can be large enough to make years of carefully built work suddenly meaningless. Looking up and making sure you're walking in the right direction matters much more than keeping your head down and perfecting every step along the way — though, of course, being able to do both is the best :)  
We stand on the shoulders of giants not just to go further, but to see further — to understand which problems will actually matter in the future.  
If a problem is likely to be easily swallowed by large models once they have sufficient data, attention, or business interest, either avoid spending years engineering a specialized solution for it, or contribute the data and benchmarks that will help move the frontier forward faster. The problems that deserve the deepest thinking and genuinely new methods are the ones where existing models fundamentally cannot do the thing you need them to do.

What I actually worry about is not that conferences will suddenly "die," but that if they start becoming genuinely irrelevant to where the frontier is moving, they will simply fade away.  
And maybe one early sign of that is that a lot of people I used to want to meet aren't really coming to conferences anymore — they're busy with the big things happening at frontier labs, or, well, busy making money.  
It reminds me a little of what happened to control theory as the field matured. As many of the core problems were gradually solved, parts of the community started inventing increasingly artificial use cases, making increasingly unrealistic assumptions, and playing increasingly elaborate mathematical games within them. That possibility genuinely scares me — not because the work becomes unnecessarily sophisticated, but because it can become disconnected from problems that actually matter.

I still believe that conferences will remain places people genuinely want to come to: to exchange ideas, reconnect with old friends, meet new people, and simply have fun together. We just need to keep doing the right things to make that happen :)

## References

1. [https://x.com/michael_j_black/status/2097585486466327003](https://x.com/michael_j_black/status/2097585486466327003)
2. [https://x.com/han_junlin/status/2097952771710623890](https://x.com/han_junlin/status/2097952771710623890)
3. [https://x.com/prime_cai/status/2098008244702908549](https://x.com/prime_cai/status/2098008244702908549)
