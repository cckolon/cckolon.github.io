---
layout: post
title: Rolling my Own Analytics
excerpt_separator: <!--more-->
image: /assets/media/rolling-analytics/dashboard-thumb.png
description: Writing my own alternative to Google Analytics for my websites
---

> To the extent you can, avoid letting intermediaries come between you and your audience. In some types of work this is inevitable, but it's so liberating to escape it that you might be better off switching to an adjacent type if that will let you go direct. *--- Paul Graham, [How to Do Great Work](https://www.paulgraham.com/greatwork.html)*
<!--more-->

When I write a new article, I like to see if people are reading it. Maybe this comes from a desire for validation, and maybe that's unhealthy. I guess I shouldn't care whether the things I write have a large audience. I should be content to know that I'm putting good work out there, and doing my best. In reality, though, I think everyone who does something creative cares if people consume and appreciate it, and I'm no exception.

When I first started putting things on the web, I thought that this would be a pretty simple desire to fulfill. Every web server keeps some sort of log, so I could just watch it and see how many hits my articles had. My sites are hosted with nginx mostly, so here's what the logs look like:

```
10.244.0.218 - - [10/Jul/2025:17:01:14 +0000] "GET /a.js HTTP/1.1" 200 7046 "https://carlkolon.com/" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
10.244.7.34 - - [10/Jul/2025:17:01:15 +0000] "OPTIONS /a HTTP/1.1" 204 0 "https://carlkolon.com/" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
10.244.7.34 - - [10/Jul/2025:17:01:20 +0000] "POST /a HTTP/1.1" 200 44 "https://carlkolon.com/" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
10.244.7.34 - - [10/Jul/2025:17:01:22 +0000] "POST /a HTTP/1.1" 200 44 "https://carlkolon.com/" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
10.244.2.246 - - [10/Jul/2025:17:01:23 +0000] "POST /a HTTP/1.1" 200 44 "https://carlkolon.com/" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/128.0.0.0 Safari/537.36"
```

It's hard to make sense of these by themselves, but there are plenty of log analyzers online that will help. [GoAccess](https://goaccess.io/) is one of the most popular. It has great built-in dashboards like the one below, and it can also make html pages that you can serve on your site. Plus, it's free and open source!

![GoAccess dashboard](/assets/media/rolling-analytics/goaccess-dashboard.png)

An approach like this works great for old-school sites running on a dedicated server, but it didn't work out-of-the-box for me, because I deploy my applications in a more "modern" (complex) way.

## How my sites are deployed

I've been putting stuff on the web seriously since about 2020 or 2021. I have 4 websites. 
- This one,
- [ewatchbill.com](https://ewatchbill.com/), a scheduler app built with React/FastAPI,
- [bearingsonly.net](https://bearingsonly.net/), a submarine combat game built with React/NodeJS,
- [jfmm.net](https://jfmm.net/), a semantic search engine built with HTMX/Django.

Since this site is static, I host it for free on [GitHub Pages](https://pages.github.com/). The other sites all require some type of backend computation, so I host them as containers on [DigitalOcean's app platform](https://vannevarlabs.atlassian.net/wiki/spaces/SE/pages/1901461507/Adding+Instagram+Areas+for+Serra). At $5 per month, this is cheaper than some approaches I've used in the past (like renting a droplet or EC2 instance), and also means that I don't have to configure HTTPS and deployment actions myself. Another nice benefit is that all my sites are hosted behind a cloudflare reverse proxy, which protects me from some types of bots and attackers (more about this later).

I have one shared postgres instance on DigitalOcean with databases for the apps that require them, and another shared redis cache. I do it like this to save money. Hosted databases are expensive!!

![A simplified diagram of my devops system](/assets/media/rolling-analytics/website-layout.png)

If I were hardcore, I'd host all my sites on my own hardware at my house, but the cloud is more convenient for a lot of reasons. Mainly, I don't have to open my home to outside traffic. I know it's possible to do this safely, but I'm worried I'll screw it up.

## Server logs won't work

So back to the server logs. On their own, they won't work. Every time I deploy my apps, the containers get rebuilt, which deletes the log files. If I want to persist logs, I would have to save them somewhere besides the file system on the container. So I'd have to save them to postgres or mount an S3 bucket or something.

Even if I did this, I'd have to face the problem of what to do about carlkolon.com. Since all the hosting infrastructure is handled centrally by GitHub, I don't have access to the server logs.

Finally, there is a lot of bot traffic. [More than half of worldwide internet traffic is bots](https://www.techradar.com/pro/security/bots-now-account-for-over-half-of-all-internet-traffic). Of these, not all are malicious! For example, I want Google crawlers to index my pages. When I post an article on Facebook or Linkedin, I want those sites to fetch the meta info to make pretty banners. But I *don't* want to fool myself into thinking those hits are actual viewers. It would be nice if I could filter out as much of them as possible.

## Google Analytics

[Google Analytics](https://developers.google.com/analytics) is what most people use for this. It's two lines of frontend code that you can copy-paste into your site's HTML. Then you can connect to a dashboard which shows you some information about your users.

![my Google Analytics dashboard](/assets/media/rolling-analytics/google-analytics.png)

Google Analytics is great in some respects, and it exposes some clear benefits of frontend analytics, compared to backend analytics. There is some information you can get from Google that you can't get from server logs alone. For example, Google Analytics can tell you the following information:

- How long your users spend viewing your page (dwell time)
- How far your users scroll down your page (scroll depth)
- Link clicks
- Form interactions

Server logs don't pick up on these things because they usually don't trigger additional requests. Your page doesn't reload when you scroll a little.

Google Analytics reports these events by executing javascript in your browser, which triggers internet requests when you scroll, click, interact, or close the page. Then these events are aggregated and anonymized, and you can view them in your dashboard.

I've used Google Analytics for years, but recently I've been tempted to move away. Mainly, I don't like sending my readers' information to Google. Even though I don't enable GA's more advanced tracking (which would necessitate a cookie banner: the scum of the internet) I don't like contributing to Google's huge database of information on people, and I hate that Google can track your behavior across many different sites. I want to disrupt it.

I also think that Google Analytics is a little too bloated for what I want. With all its features (mostly built for maximizing online revenue, which I don't make from this site) it can be hard to find the information that I actually find useful. I don't need to track "conversions" or "key events". I just want to know if anyone is reading my articles.

Finally, there are things I *do* want to see that Google Analytics doesn't provide me. For example, there are a lot of subtle cues that distinguish real traffic from bots. 

Already, frontend analytics are more likely to ignore bot traffic than server logs, because many bots won't even execute javascript. But nowadays, lots of sites are dynamic and require javascript to function at all, so a fair number of scrapers operate virtual browsers. In this case, there are a few other giveaways. Bots tend to use Linux machines, where almost all real traffic uses Mac OS or Windows. Bots often have a screen resolution set to a low, round number (like 800x400 px), whereas the screen resolution of real devices varies significantly. Bots rarely use mobile devices, where plenty of people almost exclusively browse the web from a phone.

In the logs above, you can see that the pings come from Linux devices based on their User-Agent strings.

```
Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36
```

Writing queries which ignore hits based on these criteria would probably filter out the vast majority of bots, but Google Analytics doesn't really grant you access to the underlying data. Since Google tracks users across sessions, I think they're trying to limit their liability in case people try to use the data to deanonymize users. In my case, I don't plan on collecting enough data to do that.

I evaluated a couple other tools while I was considering moving away from Google. [Matomo](https://matomo.org/) and [Umami](https://umami.is/) seem like great options, and both allow you to self-host for free. By now, though, I was starting to get the itch to do this myself.

I had recently registered [cck.sh](https://cck.sh) and planned to use it as a link shortener, so I tacked my analytics service on as an extra feature.

## Storing analytics events

Since I already had a postgres server, I decided to use that to store the data. Originally, I wanted to use something like [Vector](https://vector.dev/) to get logs from a web server and move them to postgres, but annoyingly the vector postgres backend doesn't support SSL, which is required by DigitalOcean's hosted postgres instances. Also, the task of moving logs wasn't too hard, and 
I decided to just write my own FastAPI server to do it.

In postgres, I created two tables, `analytics_sessions` and `analytics_events`. A session was created with each new page load, while an event could represent lots of types of interactions, like link clicks and page scrolls. Each event was associated with a session, so if I wanted to see everything that a user did during a visit, I could search the event rows matching a session ID. Unlike Google, I didn't persist session IDs (or any other data) across multiple page loads. If a user visits my site twice, it's two different sessions.

## Client-side code

To do frontend analytics, I needed the user's browser to report events back to the server. I wrote a simple javascript IIFE (immediately invoked function expression) to do this. First, the function would send a request back to my server on page load. This would contain some basic information about the viewer's machine. Some of these things (like user-agent or referer) are visible in the server logs, but other things (like screen resolution or )

