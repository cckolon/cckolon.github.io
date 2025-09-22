---
layout: post
title: Cycling Efficiency
excerpt_separator: <!--more-->
image: /assets/media/cycling/acceleration-graph.png
description: A Javascript applet to calculate the effect of gear shifts on your bicycle.
disable-boost: True
---

<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type="text/javascript"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.0.1/chart.umd.js"></script>
<script type="text/javascript" language="javascript" src="/assets/scripts/bike.js"></script>

Norfolk is a pretty bike friendly city. I recently got a [Trek FX 3 Disc](https://www.trekbikes.com/us/en_US/bikes/hybrid-bikes/fitness-bikes/fx/fx-3-disc/p/28474/) to ride around, and I've become familiar with some of the trails. A few of my favorite spots are the [Elizabeth River Trail](https://elizabethrivertrail.org/), [Back Bay](https://www.fws.gov/refuge/back-bay), and the [Great Dismal Swamp canal trail](https://www.cityofchesapeake.net/government/city-departments/departments/parks-recreation-tourism/parks/dismal_swamp_trail.htm).

While cycling, I sometimes ask myself: what gear should I be in when accelerating, and what gear should I stay in while cycling at a certain speed? I wanted to use some math and simulation to explore this question. I was heavily inspired by [Steve Gribble's wattage to speed graph](https://www.gribble.org/cycling/power_v_speed.html), but wanted to also look at how gear shifts affect the speed and power of the bike.

Below is a simulation of a person's speed, acceleration, gear, and cadence as they accelerate from a standstill. There's also a power graph which shows how this person's power is used. Read on to learn how I built it, or just play with the values and see what happens. <!--more-->

<div style = "overflow: auto" class = "phone-zoom"><div id = "AccelerationProfile" style = "min-width: 550px"></div></div>

|**Bike Data**                      |                                                                   |
|Bike Weight (lbs)                  |<input type = "text" id = "bikeweight">                            |
|Wheel Diameter (mm)                |<input type = "text" id = "wheeldiameter">                         |
|Chain Ring Teeth                   |<input type = "text" id = "chainringteeth">                        |
|Number of Gears                    |<input type = "text" id = "gearnum">                               |
|Rear Sprocket Teeth                |<span id="gearbox" style="display:block; max-width:9em"></span>    |
|**Human Data**                     |                                                                   |
|Human Weight (lbs)                 |<input type = "text" id = "humanweight">                           |
|Optimal Cadence (\\(\nu_{\text{opt}}\\)) (RPM)|<input type = "text" id = "optrpm">                     |
|Chosen Cadence (RPM)               |<input type = "text" id = "desiredrpm">                            |
|Max Power (\\(P_{\text{max}}\\)) (Watts)     |<input type = "text" id = "maxpower">                    |
|Frontal Area (m^2)                 |<input type = "text" id = "frontalarea">                           |
|**Simulation Data**                |                                                                   |
|Simulation Time (sec)              |<input type="text" id="simulationtime">                            |
|Initial Speed (mph)                |<input type="text" id="initialspeed">                              |
|Drag Coefficient                   |<input type = "text" id = "dragcoeff">                             |
|Coefficient of Rolling Resistance  |<input type = "text" id = "crr">                                   |
|Drivetrain Loss (%)                |<input type = "text" id = "dtl">                                   |
|Air Density (kg/m^3)               |<input type = "text" id = "airdensity">                            |
|Grade of Hill (%)                  |<input type = "text" id = "grade">                                 |
|Headwind (mph)                     |<input type = "text" id = "headwind">                              |

<br>
<div class = "center-image"><button onclick = "restoreDefaults()">Restore Defaults</button></div>
<br>

## Insights

Explore how the relationship between these numbers changes as you vary headwind, grade, gear ratios.

<ul>
<li id = "maxspeed"></li>
<li id = "maxspeedtenlbsless"></li>
<li id = "maxspeedtenwattsmore"></li>
<li id = "maxspeeddragless"></li>
</ul>

## How It Works

The above data is based on my bike, so feel free to update it with your own specs. My bike only has a rear derailleur, but if you have a front and rear one you can change the chain ring teeth to 1 and calculate the gear ratios yourself. When you change the number of gears, the rear sprocket teeth box will automatically update. The calculated gear ratios are listed below. More on these later.

<table id = GearTable></table>

Here's a quick primer on how bicycle gears work. See the following diagram (courtesy of [Sacramento Bike Kitchen](https://www.sacbikekitchen.org/)) for reference.

![bike gears](https://www.sacbikekitchen.org/wp-content/uploads/2017/06/shifting.jpg)

Most bikes have a rear [derailleur](https://en.wikipedia.org/wiki/Derailleur), a mechanism which shifts the drive chain between one of several sprockets on a cassette. The smaller the sprocket is, the faster the rear wheel will turn for a single rotation of the pedals. Sometimes, the chain wheel (or chain ring) itself has multiple sprockets, and shifting between each combination of front and rear sprockets gives a different gear ratio.

In a low gear, a single turn of the pedals produces a small rotation of the rear wheel. This gives the rider a greater mechanical advantage, and allows them to exert more force on the bike. Low gears are used for accelerating from low speeds, climbing hills, and biking into headwinds. A high gear, where a single rotation of the pedals moves the bicycle farther, is used when going downhill or traveling at high speeds.

The optimal cadence (\\(\nu_{\text{opt}}\\)) is the cadence at which the rider can produce the most power. Typically, this value is around 120 RPM[^1], which seems pretty fast. The average biker's freely chosen cadence will probably be less than this value, so it's also worth specifying a chosen cadence which the rider will try to maintain. For lots of people, this is around 80-90 RPM[^2].

[^1]: [J. Douglas, A. Ross, and J.C. Martin. "Maximal muscular power: lessons from sprint cycling".](https://sportsmedicine-open.springeropen.com/articles/10.1186/s40798-021-00341-7)

[^2]: [U. Emanuele, T. Horn, and J. Denoth. "The relationship between freely chosen cadence and optimal cadence in cycling".](https://pubmed.ncbi.nlm.nih.gov/22868209/)

The torque that a cyclist can produce is a function of their cadence. Imagine pushing the pedals on a stopped bike. You can probably generate a lot of torque, since the pedals are not moving. Contrast that with a bike that is moving at a high speed. The pedals are moving very fast, and you may not be able to apply any useful amount of force to the pedals. This decrease in torque is approximately linear[^3].

[^3]: [Dorel et al. "Force-Velocity Relationship in Cycling Revisited".](https://www.researchgate.net/profile/Henry-Vandewalle/publication/40483832_Force-Velocity_Relationship_in_Cycling_Revisited/links/5a9be8e5aca2721e3f30e47c/Force-Velocity-Relationship-in-Cycling-Revisited.pdf)

$$\tau = \tau_{\text{max}} \left(1 - \frac{\nu}{\nu_{\text{max}}}\right)$$

Where \\(\tau\\) is torque and \\(\nu\\) is rotational frequency (or cadence) measured in RPM. This requires us to know the maximum (or zero-load) torque \\(\tau_{\text{max}}\\) that a cyclist can produce, and the maximum cadence \\(\nu_{\text{max}}\\) at which the cyclist can produce torque. We can figure this out from the cyclist's power, which you can easily measure on a stationary bike. The equation for power on a bicycle is:

$$P = \tau\omega = \tau\frac{2\pi\nu}{60}$$

Where \\(\omega\\) is angular velocity measured in radians per second. Substituting in the first equation:

$$P = \tau_{\text{max}} \left(1 - \frac{\nu}{\nu_{\text{max}}}\right)\frac{2\pi\nu}{60} = \frac{2\pi\tau_{\text{max}}}{60}\left(\nu-\frac{\nu^2}{\nu_{\text{max}}}\right)$$

This is the equation for a downward-curved parabola. We can find maximum power using calculus:

$$\frac{\mathrm{d}P}{\mathrm{d}\nu}=0=\frac{2\pi\tau_{\text{max}}}{60}\left(1-\frac{2\nu}{\nu_{\text{max}}}\right)$$

Solve for \\(\nu_{\text{max}}\\):

$$\nu_{\text{max}}=2\nu$$

And since at maximum power \\(\nu\\) will be its optimal value:

$$\nu_{\text{max}}=2\nu_{\text{opt}}$$

To find \\(\tau_{\text{max}}\\) we can evaluate the power equation at maximum power and rearrange to find torque:

$$P_{\text{max}} = \frac{2\pi\tau_{\text{max}}}{60}\left(\nu_{\text{opt}}-\frac{\nu_{\text{opt}}^2}{2\nu_{\text{opt}}}\right)$$

$$\tau_{\text{max}} = \frac{60P_{\text{max}}}{\pi\nu_{\text{opt}}}$$

This gives us combined torque and power equations, depending only on \\(P_{\text{max}}\\), \\(\nu_{\text{opt}}\\), and pedaling speed.

$$\tau = \frac{60P_{\text{max}}}{\pi\nu_{\text{opt}}} \left(1 - \frac{\nu}{2\nu_{\text{opt}}}\right)$$

$$P = 2\frac{P_{\text{max}}}{\nu_{\text{opt}}}\left(\nu-\frac{\nu^2}{2\nu_{\text{opt}}}\right)$$

These are graphed below:

<div style = "overflow: auto" class = "center-image"><div id = "EfficiencyData" style = "width: 550px"></div></div>

## Forward Force on the Bike

So far, this only tells us how the legs of a cyclist will generate power. What does that tell us about what gear to use? How can we figure out the bike's acceleration in a certain gear?

It's tempting to use two equations for power: one for the cyclists legs and the other for the bike's acceleration:

$$P_{\text{bike}} = Fv = mav$$

$$P_{\text{legs}} = \tau\omega = \tau\frac{2\pi\nu}{60}$$

Where \\(F\\) is the forward force on the bike, \\(m\\) is the combined mass of the cyclist and bike, \\(a\\) is the bike's acceleration, and \\(v\\) is the bike's velocity. Equating these, we get:

$$a=\frac{2\pi\nu\tau}{60mv}$$

This is what I tried first, but there's a problem! When the bike is stationary, both \\(v\\) and \\(\nu\\) are zero! This means that we cannot find the bike's acceleration when it is stopped[^4]. Instead, we need to go a little further into the weeds.

[^4]: You could make assumptions about the continuity of these equations, and find the limit as \\(v\\) and \\(\nu\\) approach zero, but this doesn't save much time, and it's better to learn what's actually going on.

Using the equation for torque, we can determine the force that the chain ring exerts on the chain:

$$\tau = Fr\Rightarrow F=\frac{\tau}{r}$$

Where \\(r\\) is the radius of the chain ring. This force will also be exerted on the rear sprocket, since tension is uniform throughout the chain.

$$\tau_{\text{rear sprocket}} = F_{\text{chain}}r_{\text{rear sprocket}} = \tau_\text{chain ring}\frac{r_{\text{rear sprocket}}}{r_{\text{chain ring}}}$$

Using the same torque equation, we can find the force exerted on the ground by the rear wheel.

$$F_{\text{rear wheel}} = \frac{\tau_{\text{rear sprocket}}}{r_{\text{rear wheel}}} = \tau_{\text{chain ring}}\frac{r_{\text{rear sprocket}}}{r_{\text{chain ring}}r_{\text{rear wheel}}}$$

Here's a picture of the bicycle to help keep these terms straight:

![Bicycle](/assets/media/cycling/bike.png)

For the chain ring and rear sprocket to grip the chain, the teeth must be evenly spaced. This means that the radius is proportional to the number of teeth. This means that the ratio of the chain ring to rear sprocket radius is the same as the ratio between the number of teeth in the chain ring and the number of teeth in the rear sprocket. This is called the [gear ratio](https://prevelo.com/blogs/news/bicycle-gear-ratio-gear-inches-and-gain-ratio).

$$\frac{r_{\text{chain ring}}}{r_{\text{rear sprocket}}} = \frac{\text{Chain Ring Teeth}}{\text{Rear Sprocket Teeth}} = \text{Gear Ratio}$$

So the force equation becomes:

$$F_{\text{rear wheel}} = \frac{\tau_{\text{chain ring}}}{r_{\text{rear wheel}}\times\text{Gear Ratio}}$$

To simplify further, we can use the [gear inches](https://prevelo.com/blogs/news/bicycle-gear-ratio-gear-inches-and-gain-ratio).

$$\text{Gear Inches} = \text{Rear Wheel Diameter}\times\text{Gear Ratio}$$

$$F_{\text{rear wheel}} = \frac{2\tau_{\text{chain ring}}}{\text{Gear Inches}}$$

Finally, we have to consider the drive train losses (DTL), which are usually about 2-3%, and fairly consistent across gears[^5].

[^5]: [B. Rohloff and P. Greb. Efficiency Measurements of Bicycle Transmissions - a Neverending Story?](https://hupi.org/HParchive/PDF/hp55/hp55p11-15.pdf)

$$F_{\text{rear wheel}} = \frac{2\tau_{\text{chain ring}}}{\text{Gear Inches}}\times\left(1-\frac{\text{DTL}}{100}\right)$$

## Determining Acceleration

The force exerted by the rider is only one of the forces acting on the bike. We also have to consider the impact of aerodynamic drag, [rolling resistance](https://en.wikipedia.org/wiki/Rolling_resistance), the force of gravity, and the reaction force from the bike's contact with the surface. See the following free-body diagram.

![Free Body Diagram](/assets/media/cycling/free-body.png)

The reaction force will be equal to the force exerted by the bike on the ground, so it will cancel the perpendicular component of the gravitational force exerted by the bike, leaving only the net gravitational force along the surface. This can be calculated using very simple trigonometry.

![Net Gravitational Force](/assets/media/cycling/net-gravity.png)

$$F_{\text{net gravity}} = F_{\text{gravity}}\sin\left(\theta_{\text{ground}}\right) = (m_{\text{bike}}+m_{\text{human}})g\sin\left(\theta_{\text{ground}}\right)$$

Where the \\(m\\)s are the masses of the bike and rider, and \\(g\\) is the acceleration of gravity.

Drag can be calculated using the drag equation. The aerodynamic properties of the rider and bike are fairly well known, and the drag coefficient is typically between 0.6 and 0.8. See the following picture from a review of competition cycling aerodynamics[^6].

[^6]: [T. Crouch et al. Riding against the wind: a review of competition cycling aerodynamics](https://link.springer.com/article/10.1007/s12283-017-0234-1)

![Cyclist Aerodynamics](/assets/media/cycling/cyclist-aero.png)

Since the [Reynolds number](https://en.wikipedia.org/wiki/Reynolds_number) (\\(\text{Re}\\)) is high, we can use the drag equation for turbulent flow, which is proportional to the square of the velocity.

$$F_{\text{drag}} = \frac{1}{2}\rho v^2C_{\text{d}}A$$

Where \\(\rho\\) is the density of air, \\(v\\) is the velocity of the bike, \\(C_{\text{d}}\\) is the drag coefficient, and \\(A\\) is the frontal area of the rider and bike.

Rolling resistance is the resistive force generated by the tire's deformation as it rolls over the surface.

$$F_{\text{rolling resistance}} = C_{rr}F_{\text{reaction}}= C_{rr}(m_{\text{bike}}+m_{\text{human}})g\cos(\theta_{\text{ground}})$$

Where \\(C_{rr}\\) is the rolling resistance coefficient, which is typically between 0.005 and 0.015[^7].

[This website](https://www.bicyclerollingresistance.com/) offers a great comparison of tires by rolling resistance, but unfortunately the comparison is done in watts, based on [their testing conditions](https://www.bicyclerollingresistance.com/the-test). To convert these to \\(C_{rr}\\) values, you can divide by 3335.4 W.

[^7]: [W. Steyn and J. Warnich. Comparison of tyre rolling resistance for different mountain bike tyre diameters and surface conditions](https://www.researchgate.net/publication/279323381_Comparison_of_tyre_rolling_resistance_for_different_mountain_bike_tyre_diameters_and_surface_conditions)

Use Newton's second law and sum all these forces, and we get the acceleration of the bike.

$$F_{\text{net}} = m_{\text{total}}a\Rightarrow a = \frac{F_{\text{net}}}{m_\text{bike}+m_\text{rider}}$$

$$F_{\text{net}} = F_{\text{input}}  - F_{\text{drag}} - F_{\text{rolling resistance}} - F_{\text{net gravity}}$$

Since the acceleration equations are fairly tame, we can use [Euler's method](https://en.wikipedia.org/wiki/Euler_method) to numerically solve for the acceleration of the bike.

I implemented this in Javascript, and plotted the results using [Chart.js](https://www.chartjs.org/). To find maximum speeds, I simulated with larger time steps and aborted the search when acceleration was smaller than a threshold.

## Power Graphs

Calculating the amount of power devoted to each of the forces is straightforward, since power is the rate of work done by each force. In a single dimension, we can just use regular multiplication.

$$P = Fv$$

Since each force is known, and the velocity is known, the calculation is easy. I plotted these in a stack graph, so that the reader can compare the amounts of power being spent on different forces.

## References and Footnotes
