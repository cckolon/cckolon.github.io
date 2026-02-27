---
layout: post
title: Mapping My Backyard
excerpt_separator: <!--more-->
image: /assets/media/backyard/home_map_scaled.webp
image_width: 789
image_height: 558
description: Using GIS to map my family's property in Vermont.
---
I was lucky enough to get a few weeks of leave for Christmas, so I went home to my family's house in Vermont with my wife, Jackie, and [our cat](https://www.instagram.com/rockminsterfullerene/). In between camping and ski-hiking, I was looking for another little project.

My parents bought the land which our house is on when we still lived in Beijing, and there's a lot of history in the woods. Only two modern roads survive in the immediate area, but if you go into the woods it's clear that there used to be others, which have been neglected for a long time. The woods are also home to an entire system of bike trails, maintained by the [Brewster River Mountain Bike Club](http://www.brmbc.org/), of which my dad is a member. There's a lot going on up there, but if you look at Google Maps, it's utterly empty.  <!--more-->

![My backyard, in Google Maps](/assets/media/backyard/googlemaps_hometown.webp){: width="661" height="430"}

I have a neighbor who is a [GIS](https://en.wikipedia.org/wiki/Geographic_information_system) professional, and I've talked to him before about map making, mainly because I want to create more print-friendly maps of [Shenandoah](https://www.nps.gov/shen/index.htm), so I can hike without a cell phone. My dad asked if I would try making a map of the woods behind our house, and I was happy to give it a shot.

In this article, I've hidden data which is very personally identifying, so that I'm not publishing our address or our neighbors' online.

I don't want to spend 100 dollars a year on an [ArcGIS](https://www.arcgis.com/) license, and in this locked-down corporate world, [I want to use as much free and open-source software as I can](https://lessig.org/product/free-culture/), so I used [QGIS](https://www.qgis.org/) for all my mapping. I read a few [online tutorials](https://www.qgistutorials.com/) and then I started working.

First, I needed to map out the land cover of the surrounding area. Most of my town is forested, but not all. I got this data from [The National Map](https://www.usgs.gov/programs/national-geospatial-program/national-map), namely its [USGS 7.5 minute Topo Maps](https://www.sciencebase.gov/catalog/items?max=20&filter=tags%3D%7B%22type%22%3A%22Place%22%7D&q=vt). I loaded the `land cover`, `POIs`, and `trails` layers, and trashed the rest.

Actually, that's not really true. Originally I loaded all the layers, but I threw them out one by one once I found better information elsewhere, until only those three remained. On this blog, though, I'm pretending that I did everything perfectly from the start.

Surprisingly, the trails layer was pretty good. It contained a bunch of the BRMBC trails, which I labeled with a cute little bike.

![Data from The National Map](/assets/media/backyard/TNMdata.webp){: width="609" height="523"}

There were a couple of errors in the road and driveway data. My driveway was too short, a nearby road wasn't included, etc. Instead, I decided to get the road and driveway data from [OpenStreetMap](https://www.openstreetmap.org/). There is a helpful plugin for QGIS called [QuickOSM](https://plugins.qgis.org/plugins/QuickOSM/) and I followed [this tutorial](https://www.qgistutorials.com/en/docs/3/downloading_osm_data.html) to download data from it. Weirdly, on OSM, roads and driveways are labeled as "lanes" and "access" respectively, so it took some trial and error to download the right data. I combined the `lanes` and `access` layers into a layer called `all_roads`, and styled it up a bit. I added curved labels so the roads would be labeled as well.

![Road data from OSM](/assets/media/backyard/roads.webp){: width="598" height="516"}

I got a bunch of other useful data from OpenStreetMap, including building shapes, street numbers, and waterways (more accurate than The National Map).

![All OSM data](/assets/media/backyard/OSM.webp){: width="619" height="531"}

Next, I looked for elevation data. I wanted contour lines and a shaded hillside, so the landscape wouldn't look so flat. Following [this tutorial](https://www.qgistutorials.com/en/docs/3/working_with_terrain.html), I got the [GMTED2010 data](https://www.usgs.gov/coastal-changes-and-impacts/gmted2010) from [USGS EarthExplorer](https://earthexplorer.usgs.gov/). This data was pretty low-res, but if I enabled oversampling it looked okay. I stole the contour lines from The National Map dataset which I downloaded earlier. This was a pretty imperfect solution; the GMTED2010 data slices cover huge swaths of the US, and they're not well suited for this scale of mapping, but I didn't know any better. I used the [hillshade](https://earthquake.usgs.gov/education/geologicmaps/hillshades.php) algorithm to give the area a sense of depth.

![GMTED Hillshade](/assets/media/backyard/lowreshillshade.webp){: width="606" height="517"}

Yeah, it's clearly low-resolution. Don't worry, I fixed it later. But in the mean time, I had a tougher task. I knew there were old access roads and blazed trails in the woods behind our house, but I had no idea how to find a map of them. Besides the BRMBC trails, none of these were documented anywhere, and they may have never been officially recorded.

So I found them the hard way. I went hiking with Jackie, and tried her patience by running up and down trails and streams while wearing my Garmin [Fenix 5S](https://www.garmin.com/en-US/p/552237/pn/010-01685-02). We took photos of a few landmarks and marked them on the map, too. I also marked the spot where my dad and I went camping in 5 degree weather a few nights earlier. In order to incorporate the tracks into QGIS, I [got the GPX file from Garmin](https://englishcyclist.com/blogs/map-designer-faqs/getting-gpx-files-from-garmin-connect) and imported it into QGIS as a vector layer.

 Here's what our track looked like.

![My hike with Jackie](/assets/media/backyard/hikingwjackie.webp){: width="622" height="340"}

I plotted in a few of the trails and streams which we followed, but I wasn't able to nail them down perfectly. Plus, I was worried about GPS error and my own memory. At the same time, I was getting irritated with my elevation data. As I zoomed farther in, the slope became more and more pixelated. Plus, since I imported the contour lines from a vector dataset, I couldn't get any more detail out of them.

I screwed around on EarthExplorer with a few other digital elevation models, but I couldn't find one I liked, so I did a little googling, and found the excellent [1 meter Digital Elevation Models](https://www.sciencebase.gov/catalog/item/543e6b86e4b0fd76af69cf4c) from USGS. I remade the hillshading. Look at the difference!

![Comparing DEMs](/assets/media/backyard/DEMcomparison.webp){: width="1074" height="502"}

In fact, the new DEMs looked so good that I could find a lot of the trails which Jackie and I had hiked beforehand.

![Discovering trails from DEMs](/assets/media/backyard/zoomedintrails.webp){: width="616" height="525"}

I got a little interested in this: how can you find trails in the woods from DEM data? It turns out, this is a fairly well-researched topic [[1]](https://calhoun.nps.edu/handle/10945/3329) [[2]](https://www.mdpi.com/2072-4292/2/4/1120) [[3]](https://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.470.1472&rep=rep1&type=pdf), and has been studied in particular at the Naval Postgraduate School, [of which many of my friends are alumni](https://www.usna.edu/BowmanProgram/index.php)! Small world.

In [this paper](https://www.researchgate.net/publication/258716216_Detecting_trails_in_LiDAR_point_cloud_data) (which is actually about a harder topic), the authors propose using the magnitude of the gradient of DEM data as a method of finding trails. The magnitude of the gradient is also known as the slope, and QGIS contains the [GDAL slope](https://gdal.org/programs/gdaldem.html) tool for use on raster data. When I found and displayed the slope across the area, the trails almost lit up.

![Detecting trails with slope](/assets/media/backyard/slope.webp){: width="1330" height="450"}

So using this, my hike path, and a little extra knowledge from my dad, I drew and labeled (somewhat uncreatively) the trails which we had found.

![Labeled Trails](/assets/media/backyard/labeledtrails.webp){: width="767" height="514"}

While I'm a supporter of the metric system, I know that feet are the accepted unit of elevation in the US, so I wanted to translate the DEMs to feet before I made and labeled contour lines. I did this with the [Raster Calculator](https://docs.qgis.org/2.2/en/docs/user_manual/working_with_raster/raster_calculator.html). Then, I made fresh contours and labeled them with rule-based labels, so a label only appeared every 100 feet.

![Contour lines](/assets/media/backyard/contours.webp){: width="770" height="516"}

Finally, I wanted a breakdown of how much land we actually owned. The deed to our house maps out our land claim very cryptically, and we have done a few walks through the woods trying to find out exactly where the boundary is. Fortunately, there is a tool called [Parcel Viewer](https://maps.vcgi.vermont.gov/parcelviewer/) published by the [Vermont Center for Geographic Information](https://vcgi.vermont.gov/) which displays all of the property lines in the state.

![Parcel Viewer](/assets/media/backyard/parcelviewer.webp){: width="665" height="497"}

Even more conveniently, the layers on parcel viewer are [available for download](https://geodata.vermont.gov/datasets/vt-data-statewide-standardized-parcel-data-parcel-polygons-1/explore?location=44.572226%2C-72.847942%2C11.68). These layers include ownership data for each parcel, so you can tell who owns all the land. It's kind of crazy, actually. For any piece of land in Vermont, you can look up who lives there as a matter of public record.

On my map, I wanted to just label each owner's last name. The dataset has first and last names of each owner, but the last name always comes first. Fortunately, the label dialogue in QGIS supports [regular expressions](https://en.wikipedia.org/wiki/Regular_expression), so I wrote a simple regex to match the first word of each name.

![Owner Regex](/assets/media/backyard/ownerregex.webp){: width="674" height="61"}

I've blacked out our neighbors' names, even though they are a matter of public record, to try and be conscious of their privacy. Here's what the parcels looked like on my map.

![Parcels](/assets/media/backyard/parcels.webp){: width="699" height="500"}

When trying to trace out our property lines in the past, we have had to walk [lines of bearing](https://en.wikipedia.org/wiki/Rhumb_line). When trying to do this, [magnetic declination](https://en.wikipedia.org/wiki/Magnetic_declination) becomes an issue. Essentially, a magnetic compass does not reliably point towards the North Pole, or [True North](https://en.wikipedia.org/wiki/True_north). In Northern Vermont in December, 2021, it was about 14 degrees off. This may not seem like a lot, but it can be very significant when trying to walk a line of bearing between property lines.

[![Magnetic Declination](/assets/media/backyard/declination.webp){: width="1229" height="1024"}](https://commons.wikimedia.org/wiki/File:World_Magnetic_Declination_2020.pdf)

In QGIS, we can use the [magnetic declination plugin](https://plugins.qgis.org/plugins/MagneticDeclination/), published by [hacked-crew](https://hacked-crew.blogspot.com/). While the plugin can generate a compass rose, I chose to create my own.

![Compass Rose](/assets/media/backyard/compassrose.webp){: width="179" height="195"}

Finally I used [this tutorial](https://www.qgistutorials.com/en/docs/3/making_a_map.html) to create a map layout, grid lines, a scale bar, etc. And here's the finished map. Click it to see the full thing!

<a href="/assets/media/backyard/home_map.png" target="_blank">
  <img width="789" height="558" src="/assets/media/backyard/home_map_scaled.webp">
</a>

The biggest thing that I learned with this project, besides how to use GIS software, is that there's a lot of data out there. Official records which are accessible to anyone contain a lot of information that we typically think of as personal. If you want to find out someone's address, especially in a rural setting, you can probably do it with OpenStreetMap and parcel data. There's also a lot of good data around, like streams, trails, and buildings which you might think aren't documented anywhere, and very high-res elevation data, which you can use to figure out all sorts of things about the lay of the land.

And if you can't find it online, you can always hike it!

![A bridge in the woods](/assets/media/footbridge.webp){: width="450" height="600"}