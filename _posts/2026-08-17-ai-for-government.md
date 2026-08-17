---
layout: post
title: Building (and Selling) AI for the Government
image: /assets/media/ai-government/venn.jpg
image_width: 1712
image_height: 1152
description: Some notes for people who are trying to sell AI software to the military and broader government.
keywords: defense tech, government contracting, AI, startups, procurement, program of record, SBIR, FedRAMP, compliance, product management
---

I have been building AI applications for government for about three years, first at a defense tech startup (Vannevar Labs) and then at xAI. Before that, I was an active-duty submarine officer. All together, in the last 12 years, I have spent only about 30 days not employed by the government or a contractor. Luckily, I'm in one of those periods of unemployment right now, and I'd like to use this opportunity to write candidly about our shadowy industry before I start my next job (spoiler alert, it's going to be AI for the government).

Defense tech has suddenly become cool from the perspective of investors and startup founders, and many more people are interested in figuring out how they can make money off the government. As I'll discuss, this is harder than it seems.

## The primes

The current state of things is very bad.

When I worked on the crew of PCU New Jersey, a submarine under construction in Newport News Shipyard, I saw the current state of government contracting. As sailors, we were supposed to be the "demanding customer," responsible for representing the taxpayer and holding the shipyard accountable. In reality, we were anything but. In between buying $5000 wrenches and $80 rolls of duct tape, we watched the ship's estimated completion date slip three years, mostly due to poor planning and screwups. Despite their best efforts, the Navy has been utterly unable to make progress in shipbuilding, and the goal rate of two submarines a year seems more and more like a fantasy ([the best we can do right now is 1.2, even though we pay for two](https://www.cbo.gov/publication/61155)).

![Commissioning USS New Jersey](/assets/media/ai-government/njy-commissioning.webp){: width="1386" height="996"}
Me and some of my former colleagues at USS New Jersey's commissioning, three years late. By the time the ship was commissioned, I was a civilian!
{: .img-caption}

Shipbuilding is not the only area in which US defense contractors are falling short. While I was on active duty, most Navy commands used a tool called NAVFIT98 to fill out performance reviews for sailors. NAVFIT98 was developed in 1998, hence the name. In 2019, the Navy awarded a [$63 million contract](https://www.war.gov/News/Contracts/Contract/Article/1856970/contracts-for-may-23-2019/) to Deloitte[^deloitte] for IT services in support of HR modernization. Specifically, these services include [Performance Evaluation Technologies](https://www.highergov.com/contract/N0017819D7502-N0018924F3042/), enumerated in a follow-on contract. The new performance evaluation tool which was supposed to replace NAVFIT98 was called [eNavFit](https://www.navy.mil/Press-Office/News-Stories/display-news/Article/2725667/enavfit-active-duty-pilot-program-to-kick-off/).

[^deloitte]: It's unclear how much involvement Deloitte had in the development of eNavFit, since the eNavFit brand name is not spelled out in the contract. The Performance Evaluation Technologies language makes it seem like Deloitte was the prime contractor, but possibly Navy personnel or Advisory and Assistance Services (A&AS) contractors were involved. Deloitte's PET contract was cut short in 2025, which coincides with the premature end of the eNavFit program.

eNavFit was a disaster. NAVFIT98 was scheduled for deprecation in 2022, but [the Navy delayed this](https://www.mynavyhr.navy.mil/Portals/55/Messages/NAVADMIN/NAV2022/NAV22250.txt?ver=ajI0gm_W8wNT4xP0XTw9Vg%3D%3D) due to "latency issues" with eNavFit. [Military Times reported](https://www.militarytimes.com/news/your-navy/2022/12/07/glitches-delay-full-rollout-of-new-navy-eval-program/) on the delays, citing numerous embarrassing bugs like "entries entered into certain blocks... that later did not match what was on the submitted report." In 2023, the Navy delayed the NAVFIT98 deprecation again, this time until 2025, and published a [fact sheet](https://www.mynavyhr.navy.mil/Portals/55/Messages/NAVADMIN/FACT_SHEETS/Fact_Sheet_NAV_279_23.pdf?ver=ak7jidgpS-cKqGQvIoRbRg%3D%3D) explaining that they did not yet "have full confidence for Fleet wide implementation" of eNavFit. Finally, in 2025, the Navy [fully discontinued](https://navadmin-viewer.fly.dev/NAVADMIN/012/25) eNavFit, and ordered all commands to switch back to NAVFIT98. This is especially embarrassing because eNavFit was a simple CRUD app! You could vibe code it in five minutes.

If you were a startup founder, you would probably see this situation and smell money. Prime contractors get away with hilariously bad performance and are often [paid more, not less](https://www.acquisition.gov/far/16.306) for it. The [market is huge](https://fiscaldata.treasury.gov/americas-finance-guide/federal-spending/) and the incumbents are old-fashioned. Most of all, the government is desperate for change, which is evident from the [sweeping](https://www.whitehouse.gov/presidential-actions/2025/04/restoring-common-sense-to-federal-procurement/) [procurement](https://www.whitehouse.gov/presidential-actions/2025/03/eliminating-waste-and-saving-taxpayer-dollars-by-consolidating-procurement/) [modernization](https://www.whitehouse.gov/presidential-actions/2026/04/promoting-efficiency-accountability-and-performance-in-federal-contracting/) [orders](https://www.whitehouse.gov/presidential-actions/2026/01/prioritizing-the-warfighter-in-defense-contracting/) published by the Trump administration. This situation seems ripe for disruption; all you need to do is be a little better than the primes.

But would-be startup founders should approach the situation with a little humility and ask some obvious questions. If the primes are so bad, why is it rare for startups to supplant them? How have they retained their stranglehold on this market? Why have the contracting offices, so desperate for change, been unable to actually effect it? Could government contracting be harder than it seems?

Don't get me wrong, I do not believe that the current primes will dominate forever. As a patriot and taxpayer, I want startups to replace them! But I also want these startups to be clear-eyed about the challenges they will face and allocate their effort the right way, so that a greater percentage of them succeed.

## Winnerball

_Disclaimer: I am not a salesperson._

Sales is the number one thing you need to do correctly to succeed in the government. The primes understand this and they allocate a huge amount of effort to sales. Defense tech companies tend to avoid the term "sales," and talk euphemistically about "mission success," "mission development," "mission management," "capture," "GTM," "BD," etc., but I think it's actually better to call sales by name, so that everyone involved understands the goal. I'm going to include customer success and lobbying in my definition of sales, because they primarily involve convincing people to give (or keep giving) you money.

It's a common mistake for startups to neglect sales. Peter Thiel writes about this in "Zero to One":

> The engineer’s grail is a product great enough that “it sells itself.” But anyone who would actually say this about a real product must be lying: either he’s delusional (lying to himself) or he’s selling something (and thereby contradicting himself). The polar opposite business cliché warns that “the best product doesn’t always win.”

Primes can sell differently than startups. Companies with a long record of government contracts ("past performance") or many relationships on Capitol Hill will naturally find it easier to win contracts, creating a sort of "winnerball" where winning now makes it easier to win in the future.

If you're a startup, you need to do things differently. The most proven success technique is spending time with your users, often military units themselves. Military leaders are often very frustrated with legacy contractors, and will do whatever they can to increase their access to good technology. If you can show these leaders a product that is far ahead of the status quo, they sometimes will work very hard to get access for themselves and other units. Vannevar calls this "[building champions](https://vannevarlabs.com/blog/how-to-land-and-convert-your-first-defense-pilots/)."

Visiting users can be challenging. To get on a military base, you need a common access card (CAC). To discuss classified information, you need employees with clearances. Clearances take about a year to get, and to get clearances and CACs, you need to have a contract already! Winnerball. But there are some creative ways to get around these restrictions: initially deploying unclassified versions of software, or getting temporary guest passes to bases, for example. It's crucial that startup founders figure out ways to get on site with users, even though it's hard.

Once you do have a champion, you need to know what to ask for. Sometimes, they will have discretionary money that they can give you directly, but usually not. If your customer is a military unit, they may ask for money via an [Unfunded Requirement](https://www.congress.gov/crs-product/IF11964) (UFR), which is a request to Congress for additional money to fund a capability not covered by the administration's budget. UFRs are useful to startups because they allow military units to lobby on the startup's behalf, and thereby help the startup avoid the traditional budgeting cycle.

Unfortunately, you can't rely on UFRs forever.
- There is only so much money available for UFRs.
- UFRs are risky. Congress may not award the money!
- UFRs typically only allocate money on a one-year schedule, so the same level of sales effort is required each year.

The government has come up with some other ways to award money to startups outside of the traditional contracting cycle. Probably the best known of these are the [Small Business Innovation Research](https://www.sbir.gov/) (SBIR) and Small Business Technology Transfer (STTR) programs. Qualifying companies that win a SBIR will receive funding from the government to develop new technology. SBIRs are awarded in phases which unlock more money as a product concept becomes more mature.

SBIRs are a good way for companies to establish a reputation and get some funding, but you should think about them as an investment, not real revenue[^sbir-mills]. The amount of money available from a SBIR is capped, and while they are designed to eventually lead to a production contract, you need to do the work to make that happen. If the money you get from a SBIR is significantly less than what you've raised from investors, it may not even be worth it to pursue SBIR funding if it causes you to lose focus on your real goal: recurring revenue.

[^sbir-mills]: Some companies make it their mission to win as many SBIRs as possible and get a sizeable amount (or all) of their revenue that way. These companies, known as [SBIR mills](https://defensescoop.com/2025/09/08/sbir-mills-are-draining-americas-innovation-fund/), are despised by honest contractors and government officials alike. You don't want to become one of them.

Since UFRs and SBIRs are not enough, most defense tech companies eventually want their product to become a Program of Record (POR). This is how the primes do it. A POR is a capability that appears in the congressional defense budget. It can be funded over multiple years and survives continuing resolutions. It can also have a much higher price, as long as that price is approved by Congress.

The most important thing to understand about winning PORs is that your users and customers are different people. PORs are managed by [Program Executive Officers](https://steveblank.com/2024/09/17/the-directory-of-dod-program-executive-offices-and-officers-peos/) (PEOs). Often, the PEO and subordinates will not be actual users of your product, but they will control funding decisions[^peo-ssa], including how much money they ask Congress for. Even if users know that your product is obviously superior to a competitor's, your competitor may still be selected if your salespeople fail to make this difference clear to the PEO.

[^peo-ssa]: Technically, the PEO is not always the person who awards contract funding to a vendor. That is the Source Selection Authority (SSA). In practice these are often the same person, and they are almost always inside the same organization. Even if the SSA is someone else, the PEO writes the requirements that determine which vendors are competitive.

![Chain fork](/assets/media/ai-government/chain_fork.webp){: width="1300" height="868"}

The sort of thing PEOs might buy if they were in charge of procuring silverware[^the-uncomfortable].
{: .img-caption}

[^the-uncomfortable]: From "[The Uncomfortable](https://www.theuncomfortable.com/)" by Katerina Kamprani.

There is an idealized way that this contracting structure is supposed to work: the PEOs ask their units what they need, and they also ask companies what is possible (through [RFIs and RFPs](https://www.gsa.gov/small-business/training-and-events/rfis-rfqs-and-rfps)). Then, they write reasonable requirements and [advertise them](https://sam.gov/), and many companies competitively bid on them. The cheapest and best companies are selected by the PEO. To a startup founder, it would seem like you have to look at the advertised requirements and then bid on what the government wants. This is wrong.

In reality, the sales cycle starts before the requirements are written. Companies correspond officially and unofficially with PEOs to "shape" the requirements. Their goal is to get a requirement that is so specific that they will be the only company that can satisfy it, and therefore win the contract. Since many requirements are shaped like this, other businesses that try to bid on these contracts typically fail[^enabled-intelligence]. If the salespeople do a superb job and it is clear that only one company can do the work, that company may receive a [sole source contract](https://www.acquisition.gov/far/6.302). This shaping process is, of course, much easier for well-connected companies. Winnerball.

[^enabled-intelligence]: There are some significant exceptions here, like when new startup Enabled Intelligence [beat Scale AI](https://finance.yahoo.com/news/startup-60-employees-autism-spectrum-193135425.html) to win the SEQUOIA data labeling contract from NGA. Situations like this are heartwarming, but they are not the norm.

![Alec Baldwin in front of a blackboard with "Always Be Shaping" written on it](/assets/media/ai-government/glengarry.webp){: width="1792" height="1104"}

It's important to understand the motives of PEOs. If a PEO takes a chance on your startup and it ends up failing to deliver, the PEO may be fired or otherwise sanctioned. If the PEO chooses a prime who has done decent work in the past, and the prime fails to deliver, the PEO may also face consequences, but at least the decision looks sound in retrospect. Most importantly, the PEO gains little if your startup is wildly successful. All of these factors incentivize PEOs to be risk-averse. As the saying goes, no one ever got fired for buying IBM. Winnerball. To sell effectively to the PEO, you have to make a case that they will be _unable to get your capability at all_ if they go to a competitor.

## What is your product?

If you bet on AI in 2026, you are betting on future capabilities. OpenAI, Anthropic, SpaceX and others do not currently make enough revenue to justify their [sky-high valuations](https://www.theguardian.com/global/2025/nov/04/the-mind-boggling-valuations-of-ai-companies). For these valuations to make sense, you must expect that they will deliver much better products in the future[^growth-stock]. Of course, I expect that they will (and so does almost everyone), but awarding contracts based on these expectations is quite alien to many PEOs. Imagine if a new aerospace startup were to try to sell a plane, but they didn't yet know what it would look like or what its capabilities would be. It would be hard to justify awarding that new startup any money at all.

[^growth-stock]: In other words, AI companies are [growth stocks](https://en.wikipedia.org/wiki/Growth_stock).

With this in mind, AI companies selling to the government must emphasize different sides of their story to investors and customers. To investors, they should of course emphasize that future AI capabilities will be very good, but to land contracts with the government, they must have a cohesive product vision that works with what is currently available. Many product managers (or "mission strategists" or whatever) do not understand this, and try to create outlandish and futuristic products. I have seen many teams try to build something that seems just barely possible with the state of current AI tech, and these teams often fail because this task is very hard! You already need a sales miracle to succeed in government, don't bet on a technical miracle as well. 

Microsoft just signed a [$9.7 billion contract](https://www.reuters.com/business/pentagon-awards-microsoft-97-billion-deal-bid-cut-costs-end-license-sprawl-2026-05-27/) for Word, Excel, and PowerPoint. Your product does not need to be futuristic. It just needs to work.

## What does it cost?

I remember going to a defense tech conference at Stanford and hearing a panelist say "the easiest way to sell software to the government is to sell them a computer running your software." Sure enough, the Federal Acquisition Regulations (FAR) are not designed for software, they are designed for physical things like tanks and planes.

This makes pricing AI and SaaS very tricky. Government representatives are reluctant to allow any uncertainty into their purchasing agreements, so they're basically never willing to "pay as they go" or subscribe to a monthly payment agreement. This is inconvenient because that is the only way that it makes sense to sell AI and SaaS. Instead of paying for tokens, they want to buy X number of licenses and then have those licenses supported in perpetuity (or at least, for a long time).

You can easily screw yourself by writing bad contract terms. For example, if you sell API keys without a rate limit, there is no reason for the government to buy more than one! If you sell SaaS seats, you need to make sure the seats are not shared. You also need to do a much better job than most startups at determining your costs and writing a price that allows you to make money. A B2B SaaS company can change API prices if it's more expensive than they thought to run their software, but you don't have that luxury.

You should ask for more money than you think.

## What is necessary and what is possible

Product managers for government AI companies need a very rare set of skills. They need to understand the user's requirements, which typically means that they are a veteran of some type of government service, but they also need to understand the current capabilities of AI. Finding someone like this, who knows *what is necessary and what is possible*, is really hard. It's so hard, in fact, that many defense tech companies seem not to do it at all.

In the absence of good product management, these companies move in circles. They have salespeople (usually veterans of government service) who promise unrealistic things to the customer, and they have engineers (usually with big tech or, at best, defense tech engineering experience) who build things that the customer doesn't want. Both of these teams can be very talented, which makes it more frustrating when their work doesn't end up earning any money. The salespeople become frustrated with the engineers ("how hard can it be to build feature X?") and the engineers become frustrated with the salespeople ("they're always asking for stuff, and unable to sell what we build"). The users soon become frustrated too, because the company is unable to deliver on the things that it (shouldn't have) promised. In the long run, this causes companies to lose their last hope: the "champions" that they built early in their sales history.

So you can't neglect product management. But what if you can't find a person who fits perfectly, but you hire them anyway? The absence of product management is bad, but mediocre product management is possibly worse. As discussed above, a good product manager knows what is necessary and what is possible.

If your product managers don't know what's necessary, they will often default to building things they _think_ the government wants. The public image of the military is shaped by action films and video games, so products from inexperienced product managers tend to follow suit: excessively tactical, niche, and sexy. The engineers will be more than willing to build these things, and you can invest a lot of time and money in them before discovering that the user doesn't want them.

![A venn diagram of what the government wants and what civilians think the government wants](/assets/media/ai-government/venn.jpg){: width="1712" height="1152"}

An appropriately user-obsessed company will fix this by soliciting feedback from users during a trial period: a very good idea! Unfortunately it is easy to ask the user a half-assed question like "do you like the product?" or "do you need this?" to which they will always answer "yes." It costs them nothing to tell you your product is great, because they do not have purchasing authority; that's the PEO's job! If you want to generate meaningful feedback this way, you have to ask harder questions: "Can you call us out publicly for doing a good job?" "Can you send a letter to your boss asking for this capability?" "Can you submit a UFR?" "No? Well, what would it take?" This sounds an awful lot like sales, but product management needs to be involved here or else they will never learn what the customer actually needs.

If your product managers don't know what's possible (in other words, they don't have good instincts or knowledge about AI), you should just admit you made a hiring mistake and lay them off.

Sometimes a user will tell you that they want something: "can you build us feature X?" [Saying no](https://grugbrain.dev/#grug-on-saying-no) here is very hard, especially for a salesperson, but a good product manager should be able to do it on occasion. When a customer asks you for something, your product managers should immediately try to figure out the following:
- How hard will it be to build? Often the answer here [will be surprising](https://xkcd.com/1425/). This is why product managers need good instincts about what is possible in AI.
- How much does the user want it? Again, you can try to gauge this by asking the user for some type of advocacy: "If we build feature X, will you ask your boss to pay us?"

If you do decide that you should build the feature, try to do it as fast as you can and display it to the user as soon as possible. This will set you apart from the primes, who are utterly incapable of this sort of thing.

## Comply or die

Working in government tech is hard for engineers. To most engineers, feature work and business logic is exciting. Unfortunately, government tech provides less of this type of excitement than other fields. If you can't deal with this, you should work on something else.

I think that a healthy gov tech engineering team spends about 70% of their time on compliance. This probably seems insanely high.

By compliance, I mean things like:
- vulnerability scanning and patching
- airgap or secure network deployment
- implementing systems like multi-factor-authentication
- ensuring [FIPS](https://www.nist.gov/federal-information-processing-standards-fips) compliance
- writing auditable event logging systems
- exporting and checking [SBOMs](https://www.cisa.gov/topics/information-communications-technology-supply-chain-security/sbom)
- and more!

A successful gov tech company will need to be compliant with many requirements: [FedRAMP](https://www.fedramp.gov/) at a bare minimum, but also likely [IL4](https://learn.microsoft.com/en-us/azure/compliance/offerings/offering-dod-il4)/[5](https://learn.microsoft.com/en-us/compliance/regulatory/offering-dod-il5)/[6](https://learn.microsoft.com/en-us/azure/compliance/offerings/offering-dod-il6), [Executive Order 14028](https://www.nist.gov/itl/executive-order-14028-improving-nations-cybersecurity), [NIST SSDF](https://csrc.nist.gov/projects/ssdf), possibly [ITAR](https://www.pmddtc.state.gov/ddtc_public?id=ddtc_kb_article_page&sys_id=24d528fddbfc930044f9ff621f961987), etc.

Most companies separate compliance work from normal engineering work. There is usually a team of hardcore engineers who do all the "fun" feature work (Team 1), and then a separate team of compliance professionals who rein the engineering team in and try to make the stuff they write actually deployable (Team 2). Team 2 is usually far behind Team 1, and they become frustrated with each other. While making design decisions, Team 1 does not consider compliance. Team 2, on the other hand, does not understand the product, and grows to resent the dessert-eaters in Team 1 who only do the fun stuff. In my view, the only way out of this situation is to eliminate Team 2 entirely, and make all teams responsible for compliance work on their software. In other words, compliance work needs to be elevated to the same level as feature work.

Most government SaaS teams do some form of "low-side development, high-side deployment," meaning that there is some development instance of the software on a commercial network with fewer controls, and a secure, production environment inside the government's walled garden. This, by itself, is a good strategy and makes development much faster, but it can be dangerous too. It is easy to make the development instance look good, so the engineering team will naturally want to demo the product there. This invariably leads to demos of features that aren't actually ready for production. It is common to hear something like "we just have to work out a few kinks before this is ready for users." Like I said above, often those kinks are about 70% of the work.

![It works on my machine](/assets/media/ai-government/works-on-my-pc.webp){: width="500" height="700"}

Send this to your engineers when something works in dev and not prod.
{: .img-caption}

If you're doing classified work, the whole engineering team should be cleared, otherwise the non-cleared people will gradually grow apart from the actual requirements of your software. This is hard to do but it's [getting better](https://steveblank.substack.com/p/security-clearances-at-the-speed). You should try to hire already-cleared people rather than hire people and then try to get them a clearance, which is a long, unpredictable process. Only hiring cleared engineers shrinks your candidate pool and makes things harder for your recruiters, but it's better than the alternative "in-group, out-group" dynamic that develops when only half the team is cleared.

For your engineers to hold clearances at all, you need a [Facility Clearance](https://www.dcsa.mil/FCL/Maintaining-Personnel-Security-Clearances/) (FCL), which typically requires a government contract spelling out your need for cleared employees. If you need this, it's crucial that you get your early contracts (even SBIRs or whatever) to spell out an FCL requirement. The government is starting to see how much of a blocker this is for defense tech companies, and is doing some [good work](https://www.darpa.mil/research/programs/turbofcl) to try to make it happen faster, but you should still expect this to be a terrible, bureaucratic slog.

To deploy your software anywhere secure, you also need an [Authorization to Operate](https://digital.gov/resources/an-introduction-to-ato) (ATO)[^ato]. Getting an ATO is a long process (shocker), but it also requires your product to have a certain amount of solidity. It will probably be painful to submit your ATO before you feel like your product is ready for users, but start the process early. Modifying an existing ATO is much easier than starting from scratch.

[^ato]: Often incorrectly called an "Authority to Operate."

In all of these processes (ATO, FCL, FedRAMP certification, etc.) there are ways to get it done faster than you might expect. The government is uniquely motivated to use AI and buy from startups right now. If you want to take advantage of this, though, you can't just ask the government to go faster. You have to know what to ask for, and you have to know where the bottlenecks are. It may be valuable to sit down with the inspectors, Authorizing Officers, contracting officials, etc. to figure this out. The worst place to be is waiting, but unsure what you're waiting for. If you're not careful, you can be in this situation for years.

It is important to be compliant of course, but government security requirements will very often put you in impossible situations. As an example, it is very common for customers to insist that some aspect of their requirements is Controlled Unclassified Information (CUI). CUI is not important enough to cause real national security harm if leaked (or else it would be classified) but it is important enough that you need [special handling and certification](https://csrc.nist.gov/pubs/sp/800/171/r3/final). Of course, none of the tools that you probably use (Slack, GitHub, Notion) meet these certification requirements[^govslack]. If you work with government representatives here, they can sometimes offer you a creative solution like agreeing that only a small portion of the data they hand you is CUI (or classified, or whatever). Often, they don't realize how much pain marking something CUI causes for contractors, so help them understand!

[^govslack]: You may be able to fix this with access to [GovSlack](https://slack.com/solutions/govslack), but Slack doesn't meet these requirements by default.

Some government representatives will stand on principle and refuse to bend the rules like this, which is a great sign that you should work with someone else.

## Getting stuck

All of my advice above boils down to this: there are many ways to get stuck when you're selling software to the government. Here are some of the ones I've covered.
- You can get stuck writing bids that don't get accepted because you don't understand the sales cycle.
- You can get stuck waiting for a user to decide whether to submit a UFR.
- You can get stuck working on a product that is too ambitious or poorly conceived.
- You can get stuck supporting an old product for cheap because you locked yourself into a contract unwisely.
- You can get stuck trying to sell a product that your users won't admit they don't want.
- You can get stuck building features reactively because your users keep asking for things and your product managers can't say no.
- You can get stuck writing demoware for your dev instance when prod doesn't work.
- You can get stuck waiting for an FCL.
- You can get stuck waiting for an ATO.
- You can get stuck following insane guidelines for managing data which is controlled as CUI/classified (but shouldn't be).
- You can get stuck working with a stickler PEO who wants you to jump through hoops.

The ultimate mark of a good defense tech founder is detecting when the team is stuck, and helping them get unstuck. Detection is harder than you think; it's hard to admit when you're stuck, so your team will be defensive and try to explain that the situation is not so bad. You need to be able to detect this and squash it in spite of what they might say; cancel the underperforming product, call the PEO, find a new FCL sponsor, decline to build the feature. Do whatever uncomfortable thing is necessary to make your company successful.

## Footnotes
