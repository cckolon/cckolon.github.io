---
layout: post
title: Testing Torpedos Part 1
excerpt_separator: <!--more-->
image: /assets/media/cbdr.png
description: Using multiple targeting theories to design torpedos in a video game.
---
I've played pretty much all the big modern submarine simulations ([Dangerous Waters](https://store.steampowered.com/app/1600/Dangerous_Waters/), [688I](https://store.steampowered.com/app/2900/688I_HunterKiller/), [Silent Service](https://store.steampowered.com/app/329660/Silent_Service/), [Sub Command](https://store.steampowered.com/app/2920/Sub_Command/), etc.), and in my opinion, [*Cold Waters*](http://killerfishgames.com/) is the most fun by far. It's not the most realistic game: there is pretty much no parallel between *Cold Waters* and how sonar, tracking, classification, etc. work in real life. Damage control is pretty simplistic. Driving the submarine is easy. That's all okay, because that isn't what *Cold Waters* is about. The fun part is [dodging torpedos](https://www.youtube.com/watch?v=nAQDD9CrtxM). <!--more-->

And it is so fun. Honestly, if I shoot and kill a sub in *Cold Waters* and they never shoot back, I get disappointed! All the challenge and accomplishment of the game lies in evading incoming weapons, and perfectly placing yours.

So, when I went to design torpedo guidance in my own game, I knew it was high stakes. Even more than *Cold Waters*, I want this game to be about the interactions between submarines and torpedos. I want incoming torpedos to be smart, devious weapons which you have to be really skilled to evade. I want to replicate the sense of accomplishment that I get when I send a torpedo into the bottom in *Cold Waters*.

![Dodging A Torpedo](/assets/media/dodge.png)

Guiding torpedos in real life is very hard. Most of the challenges involve the technical oolies of underwater navigation, target detection, mechanical engineering... I don't want to open that can of worms. For me, the torpedo always knows where it is, and if the target is close enough, it knows exactly where the target is. The torpedo's speed and turn rate are restricted. The torpedo runs for a set amount of time, and then explodes (failure). If it hits the target, it explodes too (success).

I will test a few algorithms. There are a few criteria which we can use to decide which is the best. 
* An algorithm which succeeds more often is better.
* An algorithm which succeeds in less time is better.
* An algorithm which succeeds at the same rate with lower speed is better.
* An algorithm which succeeds at the same rate with lower turn rate is better.

Even in this simplified problem space, guiding the torpedo on target is not an easy problem! There is a [whole field of study](https://en.wikipedia.org/wiki/Guidance,_navigation,_and_control) devoted to the topic.

## The Torpedo Code

If you want to see the code for each torpedo, [you can see them on Github](https://github.com/cckolon/torpedo-evasion/tree/main/Assets/torpedo) with the other game files. I'll just provide a brief description of each subroutine here.

The `Start` subroutine is called once at the beginning of the game. It initializes some important variables and searches the game for enemies, all of whom will have the tag `"Player"` or `"AIPlayer"`. Then it adds all the enemies to a list called `targetlist`, only excluding the player who shot it. It also turns off collision so that it can exit the shooter's submarine, and starts a Coroutine to turn it on in one second. Finally, it initializes a recurring process called `DetectEnemy`, which scans for enemies in front of the torpedo.

The `FixedUpdate` subroutine is the main loop of the program, which runs 50 times per second. If the torpedo is not enabled (that is, it has not yet seen a target), it will activate the `Transit` subroutine, which keeps it moving towards the direction in which it was fired. If the torpedo is enabled, it will decide if it can currently see an enemy. If it can, it will guide towards that enemy using the `HuntTarget` algorithm. If not, it will go to the enemy's last known location and drive circles until it finds an enemy again.

For testing, I enabled another few features. When the torpedo hits a target, it will not explode. Instead, it will stop for 10 seconds and then resume attacking the target (I called the subroutine `DisableForTest`). It will also tally how many times it hits the target, and provide a report after a user-specified number of seconds. This allows me to easily compare each torpedo's performance against several targets.

When varying the guidance algorithms of different torpedos, I only changed the `HuntTarget` algorithm. The rest of this article is devoted only to different variations on this algorithm.

Below is a simplified flowchart of how the torpedo logic works.

![Torpedo Logic](/assets/media/torpedologic.svg)

## Naive Control

I called the first, simplest algorithm "naive control". This one was the easiest to put into practice. The torpedo continually applies a torque necessary to point itself at the target. With a non-maneuvering target, this results in a [tail chase](https://en.wikipedia.org/wiki/Tail-chase_engagement), also known as a stern chase. This may seem like a good tactic, but there are a few disadvantages.

* Since there is a smaller amount of relative speed between the torpedo and target, it will take a longer time for the torpedo to catch a target with a given speed advantage ("[a stern chase is a long chase](https://www.oxfordreference.com/view/10.1093/oi/authority.20110803100531801)").
* If the torpedo does not have a speed advantage, it will not catch the target.
* If the target can turn faster than the torpedo, it is possible to outmaneuver the torpedo by relatively simple maneuvers (e.g. turning in a tight circle).

This is the `HuntTarget` subroutine for naive control.

{% highlight c# %}
void HuntTarget()
{
    Vector3 targetdirection = target.transform.position - transform.position; //vector from torpedo to target
    float targetDist = targetdirection.magnitude; //distance to target
    if (targetDist<detectionRange/3.3 & Vector3.Dot((target.transform.position-transform.position).normalized,transform.forward.normalized)>cosdetectionangle)//target is detected
    {
        Vector3 targetCross = Vector3.Cross(transform.forward.normalized,targetdirection.normalized); //use the cross product to find angle between where the torp is pointing and where it needs to point
        desiredRotation = targetCross.normalized*Mathf.Clamp(10*Mathf.Asin(targetCross.magnitude),0,1)+Vector3.Cross(transform.up,Vector3.up); //use arcsin of the magnitude of targetcross to find the angle, in radians. Torque is proportional to that. Multiply by the normalized axis.
    }
    else
    {
        interceptPoint = target.transform.position; //drive towards the target's last known location
        target = null;
        targetRb = null;
    }
}
{% endhighlight %}

## Leading the Target

To solve some of the problems of naive control, we could try [leading the target](https://en.wikipedia.org/wiki/Deflection_(ballistics)). Leading the target requires a calculation of where the target will be in the future, based on the target's velocity, and how much time it will be before the torpedo hits the target, also known as the *time to go*.

We can calculate the collision point, \\(\overrightarrow{R}_C\\), using a constant-speed solution:
$$\overrightarrow{R}_C=\overrightarrow{R}_T+t_{go}\overrightarrow{V}_T$$
Where \\(\overrightarrow{R}_T\\) is the target's current position, \\(t_go\\) is the time to go, and \\(\overrightarrow{V}_T\\) is the target's velocity vector.

The target's position and velocity are known. I'll explain the time to go calculation in the PN with ZEM section.

After calculating the collision point, the torpedo simply aims at it. There are a few advantages of this method over naive control.

* It is possible to hit a target with a speed advantage, in some situations.
* Less maneuvering is required. In fact, if the target does not maneuver, no turns are required once the torpedo is on a collision course.

There are still disadvantages, though. If the target maneuvers, the collision point may move many times faster, which, at least in theory, could cause the torpedo to miss.

![Circular Evasion](/assets/media/circleevasion.svg)

This is the `HuntTarget` subroutine for lead control.

{% highlight c# %}
void HuntTarget()
{
    Vector3 relativemotion = targetRb.velocity - rb.velocity.magnitude*transform.forward; //relative velocity between torpedo and target
    Vector3 targetdirection = target.transform.position - transform.position; //vector from torpedo to target
    float targetDist = targetdirection.magnitude; //distance to target
    if (targetDist<detectionRange/3.3 & Vector3.Dot((target.transform.position-transform.position).normalized,transform.forward.normalized)>cosdetectionangle) //target is detected
    {
        float tgo = targetdirection.sqrMagnitude/Mathf.Max(Mathf.Abs(Vector3.Dot(relativemotion,targetdirection)),.1f); //calculate time to go
        interceptPoint = target.transform.position + targetRb.velocity*tgo; //calculate intercept point based on target's velocity (linear)
        interceptMarker.position = interceptPoint; //move red intercept marker to display intercept point
        Vector3 targetCross = Vector3.Cross(transform.forward.normalized,targetdirection.normalized); //use the cross product to find angle between where the torp is pointing and where it needs to point
        desiredRotation = targetCross.normalized*Mathf.Clamp(10*Mathf.Asin(targetCross.magnitude),0,1); //use arcsin of the magnitude of targetcross to find the angle, in radians. Torque is proportional to that. Multiply by the normalized axis.
    }
    else
    {
        interceptPoint = target.transform.position; //drive towards the target's last known location
        target = null;
        targetRb = null;
    }
}
{% endhighlight %}

## Intercept Approach

So, leading the target works well for a target which travels in a straight line, but not necessarily for a maneuvering target. To fix this, I wanted to update my torpedo's collision point with a term which would compensate for acceleration.

I used a [constant linear acceleration](https://en.wikipedia.org/wiki/Equations_of_motion#Constant_linear_acceleration_in_any_direction) model because it was the simplest. Now I calculated the intercept point \\(\overrightarrow{R}_i\\) by the following formula:

$$\overrightarrow{R}_i=\overrightarrow{R}_T+\overrightarrow{V}_Tt_{go}+\frac12\overrightarrow{a}_Tt_{go}^2$$

Where \\(\overrightarrow{a}_T\\) is the acceleration of the target. Now, if the submarine were turning in a circle, the constant acceleration towards the center would push the intercept point inward, allowing the torpedo to close the distance. More generally, the torpedo would adjust its intercept point in the direction of the maneuver once the target began maneuvering, rather than waiting for the target's speed to change appreciably.

![Solving the circular acceleration problem](/assets/media/circleacceleration.svg)

There is a problem associated with this method; if \\(t_{go}\\) is too large, \\(\overrightarrow{a}\_Tt\_{go}^2\\) could become huge, causing the acceleration term to dominate the value of \\(\overrightarrow{R}\_i\\). This would usually happen if the torpedo was far from the target, since this would lead to a large value of \\(t\_{go}\\). To mitigate this problem, I set a *terminal distance* of 1000 yards. If the torpedo was outside of the terminal distance, \\(t\_{go}^2\\) was likely to be large and the acceleration was likely to change before the torpedo caught up with the target, so the torpedo would disregard the acceleration term and lead the target normally. Once closing inside the terminal distance, it would begin to use acceleration to refine its solution.

Another implementation issue with this technique is that acceleration in Unity is not necessarily smooth. Forces (and therefore accelerations) are calculated individually each frame. This can lead to a large amount of jitter in the target position if this point is based on acceleration. To fix this issue, I wanted to use a concept like a [low pass filter] to smooth the acceleration. I used the following equation to calculate acceleration:

$$\overrightarrow{a}_{T,\text{this frame}}=c\overrightarrow{a}_{T,\text{last frame}}+(1-c)\frac{\overrightarrow{V}_{T,\text{this frame}}-\overrightarrow{V}_{T,\text{last frame}}}{\Delta t_\text{frame}}$$

\\(c\\) is a constant between 0 and 1, which I called the *acceleration inertia*, which governs how slowly calculated acceleration responds to the target's movement. I set it as a public variable (one I could manipulate during testing). To assess whether jitter was still present, I had the program display the intercept point as a red sphere, so that I could see it moving.

This is the `HuntTarget` subroutine for intercept control.

{% highlight c#%}
void HuntTarget()
{
    Vector3 relativemotion = targetRb.velocity - rb.velocity.magnitude*transform.forward; //relative velocity between torpedo and target
    Vector3 targetdirection = target.transform.position - transform.position; //vector from torpedo to target
    float targetDist = targetdirection.magnitude; //distance to target
    if (targetDist<detectionRange/3.3 & Vector3.Dot((target.transform.position-transform.position).normalized,transform.forward.normalized)>cosdetectionangle) //target is detected
    {
        targetAcceleration = (1-accelerationInertia)*(targetRb.velocity - lastVelocity)/Time.fixedDeltaTime+accelerationInertia*targetAcceleration; //calculate target acceleration, including low-pass filter
        lastVelocity = targetRb.velocity; //reset target's last velocity
        float tgo = targetdirection.sqrMagnitude/Mathf.Max(Mathf.Abs(Vector3.Dot(relativemotion,targetdirection)),.1f); //calculate time to go
        if (targetDist < terminalDistance/3.3) //target is close enough to account for acceleration
        {
            interceptPoint = target.transform.position + targetRb.velocity*tgo + targetAcceleration*tgo*tgo/2; //calculate intercept point based on acceleration and velocity
        }
        else
        {
            interceptPoint = target.transform.position + targetRb.velocity*tgo; //calculate intercept point based on velocity (linear)
        }
        interceptMarker.position = interceptPoint; //move red intercept marker to display intercept point
        Vector3 interceptdirection = interceptPoint - transform.position; //intercept direction is the vector from torpedo to intercept point
        Vector3 targetCross = Vector3.Cross(transform.forward.normalized,interceptdirection.normalized); //use the cross product to find angle between where the torp is pointing and where it needs to point
        desiredRotation = targetCross.normalized*Mathf.Clamp(10*Mathf.Asin(targetCross.magnitude),0,1); //use arcsin of the magnitude of targetcross to find the angle, in radians. Torque is proportional to that. Multiply by the normalized axis.
    }
    else
    {
        interceptPoint = target.transform.position; //drive towards the target's last known location
        target = null;
        targetRb = null;
    }
}
{% endhighlight %}

## Proportional Navigation

The intercept approach seemed like a good solution to me, but I was curious about how the real-life experts did it, so I googled around a bit, and stumbled on [proportional navigation](https://en.wikipedia.org/wiki/Proportional_navigation) (PN), and [Ben Dickinson's awesome videos](https://www.youtube.com/watch?v=cXDyyQrfY5M&t=192s).

As a Naval Officer, I found PN very intuitive. A classic danger sign of an imminent collision is known as CBDR ([constant bearing, decreasing range](https://en.wikipedia.org/wiki/Constant_bearing,_decreasing_range)). On submarines, we often refer to CBDR as "zero bearing rate", or a "trace standing up". Essentially, if another ship remains down the same bearing to your ship, and your range is decreasing, you are on a collision course. PN takes advantage of this principle by trying to *create* a CBDR situation.

![CBDR](/assets/media/cbdr.svg)

If the target's bearing is drawing left, the PN torpedo turns left. If the bearing rate is drawing right, the PN torpedo turns right. Mathematically, if we call the bearing to the target \\(\lambda\\), and the torpedo's heading \\(\gamma\\), we use the following guidance law:

$$\dot{\gamma}=N\dot{\lambda}$$

Where the dots refer to the time derivatives of each angle, and \\(N\\) is a gain constant chosen by the user.

In the image below, you can see the principle of the method. The torpedo's bearing to the submarine is initially drawing right, indicating that the submarine will pass in front of the torpedo. To compensate, the torpedo turns right, until the submarine's bearing is constant, creating a CBDR situation and therefore a collision course.

![PN in 2D](/assets/media/2dpn.svg)

My first implementation of PN was a 2-dimensional version. I would calculate the bearing to the target, and the next expected bearing to the target (based on current speed of the torpedo and the target). I would subtract these to find the bearing drift, and add a torque about the y (up) axis proportional to the difference. Finally, in order to keep the torpedo upright and at the correct depth, I would apply a torque proportional to:

$$\text{torpedo's up axis}\times\left(\text{real world up axis}+\text{torpedo's fwd axis}*\text{depth compensation}\right)$$

I used the cross product \\(a\times b\\) to create a torque which would crudely rotate vector \\(a\\) onto vector \\(b\\). Vector \\(a\\) was the torpedo's upward axis. Vector \\(b\\) was the real-world upward axis, tilted forward or backward proportionally to the difference in depth between the torpedo and target (\\(\text{depth compensation}\\)). This would make the torpedo seek the target's depth.

This is the `HuntTarget` subroutine for 2D PN control.

{% highlight c# %}
void HuntTarget()
{
    Vector3 relativemotion = targetRb.velocity - rb.velocity.magnitude*transform.forward; //relative velocity between torpedo and target
    Vector3 targetdirection = target.transform.position - transform.position; //vector from torpedo to target
    float targetDist = targetdirection.magnitude; //distance to target
    if (targetDist<detectionRange/3.3 & Vector3.Dot((target.transform.position-transform.position).normalized,transform.forward.normalized)>cosdetectionangle) //target is detected
    {
        float relativebearing = Vector3.SignedAngle(transform.forward,targetdirection,Vector3.up); //relative bearing to target
        float nextrelativebearing = Vector3.SignedAngle(transform.forward,targetdirection+relativemotion*Time.fixedDeltaTime,Vector3.up); //calculate next relative bearing using relative motion and system time step
        desiredRotation = Vector3.Cross(transform.up, Vector3.up-transform.forward*Mathf.Clamp(target.transform.position.y-transform.position.y+((transform.eulerAngles.x+180)%360-180)/2,-20,20)/10); //set the desired rotation to maintain torpedo upright and seek appropriate depth
        desiredRotation += transform.up*pnGain*(nextrelativebearing - relativebearing)/Time.fixedDeltaTime; //add a torque proportional to the rate of change of bearing between torpedo and target
    }
    else
    {
        interceptPoint = target.transform.position; //drive towards the target's last known location
        target = null;
        targetRb = null;
    }
}
{% endhighlight %}

## 3D PN with ZEM

The most complicated algorithm I will use is an extension of the Proportional Navigation algorithm to three dimensions. I modified the algorithm presented  in [this video](https://www.youtube.com/watch?v=CMOh2xWk_qA).

In the picture below, we have the vector from the projectile (torpedo) to the target (submarine) position, which we call \\(\overrightarrow{R}\_{T/P}\\). We also have the velocity vector of the projectile and the target, \\(\overrightarrow{V}\_{P}\\) and \\(\overrightarrow{V}\_{T}\\). We can subtract these two vectors to find the overall velocity vector between the two objects, \\(\overrightarrow{V}\_{T/P}\\).

$$\overrightarrow{V}_{T/P} = \overrightarrow{V}_T-\overrightarrow{V}_P$$

![Calculating VTP](/assets/media/vtp.svg)

Since \\(\overrightarrow{V}\_T\\) and \\(\overrightarrow{V}\_P\\) do not change unless the projectile or target maneuvers, \\(\overrightarrow{V}\_{T/P}\\) remains the same as well. We can calculate the relative position vector \\(\overrightarrow{R}\_{T/P}(t)\\) for any time in the future, assuming that the target does not maneuver, by using the equation:

$$\overrightarrow{R}_{T/P}(t) = \overrightarrow{R}_{T/P}(0) + \overrightarrow{V}_{T/P}t$$

Where \\(t\\) is some time in the future.

![The trajectory of the submarine over time, relative to the torpedo](/assets/media/misstrajectory.svg)

Clearly, in this case, the submarine will pass behind the torpedo. In other words, the torpedo will miss the submarine by passing in front of it. The vector by which the torpedo misses is called the *Zero Effort Miss* (ZEM).

![Zero Effort Miss](/assets/media/zemexample.svg)

In particular, we are interested in the *orthogonal ZEM*. This is the ZEM vector in the plane orthogonal to \\(\overrightarrow{R}_{T/P}\\).

In order to calculate the ZEM, we need an estimate of the *time to go* \\(t_{go}\\), that is, the amount of time remaining until the torpedo should hit its target. By using a smart (simple) estimate of the time to go, we can simplify our calculations by having the ZEM equal the orthogonal ZEM.

We calculate \\(t_{go}\\) by projecting the overall velocity vector \\(\overrightarrow{V}\_{T/P}\\) between the torpedo and target onto the line of sight vector \\(\overrightarrow{R}\_{T/P}\\) to find the speed in the direction of the target. We then use a linear speed equation (time = distance/speed) to find the time remaining:

$$\begin{align*}t_{go} &= \frac{\text{distance to target}}{\text{speed in direction of target}}\\&=\frac{\left\lVert \overrightarrow{R}_{T/P}\right\rVert}{\left\lVert\mathrm{proj}_{\overrightarrow{R}_{T/P}}\left(-\overrightarrow{V}_{T/P}\right)\right\rVert}\end{align*}$$

Using a [standard projection equation](https://en.wikipedia.org/wiki/Vector_projection):

$$t_{go} = \left\lVert \overrightarrow{R}_{T/P}\right\rVert\frac{\left\lVert \overrightarrow{R}_{T/P}\right\rVert}{\left(-\overrightarrow{V}_{T/P}\right)\cdot \overrightarrow{R}_{T/P}}=\frac{\left\lVert \overrightarrow{R}_{T/P}\right\rVert^2}{\left(-\overrightarrow{V}_{T/P}\right)\cdot \overrightarrow{R}_{T/P}}$$

We can then use the ZEM formula:

$$\overrightarrow{\mathrm{ZEM}}=\overrightarrow{R}_{T/P}+t_{go}\overrightarrow{V}_{T/P}$$

To prove that this ZEM is orthogonal to the line of sight vector \\(\overrightarrow{R}\_{T/P}\\) we just need to show that the dot product \\(\overrightarrow{R}\_{T/P}\cdot\overrightarrow{\mathrm{ZEM}}\\) is zero. Sure enough:

$$\begin{align*}\overrightarrow{\mathrm{ZEM}}\cdot \overrightarrow{R}_{T/P}&=\overrightarrow{R}_{T/P}\cdot \overrightarrow{R}_{T/P}+\frac{\lVert \overrightarrow{R}_{T/P}\rVert^2}{\left(-\overrightarrow{V}_{T/P}\right)\cdot \overrightarrow{R}_{T/P}}\overrightarrow{V}_{T/P}\cdot \overrightarrow{R}_{T/P}\\&=\lVert \overrightarrow{R}_{T/P}\rVert^2-\lVert \overrightarrow{R}_{T/P}\rVert^2=0\end{align*}$$

Now that we can easily compute the orthogonal ZEM, Ben Dickinson proposes the following proportional guidance law in the video:

$$\overrightarrow{a}_P=\frac{N\cdot \overrightarrow{\mathrm{ZEM}}}{t_{go}^2}$$

In other words, the torpedo should accelerate in the direction of the ZEM. \\(N\\) is the proportional gain (similar to 2-dimensional PN) and \\(\overrightarrow{a}_p\\) is the desired acceleration of the torpedo.

This assumes that we can instantaneously accelerate in any direction, which is not true for a torpedo. I want the torpedo to maintain the same speed, but *turn* in the appropriate direction instead. To do this, I can find the desired new velocity, which is the old velocity with the desired acceleration added, \\(\overrightarrow{V}_P+\overrightarrow{a}_P\\), and calculate the required turn \\(\tau\\) using the [cross product](https://en.wikipedia.org/wiki/Cross_product):

$$\tau = \overrightarrow{V}_P\times(\overrightarrow{V}_P+\overrightarrow{a}_P)$$

Using the properties of the cross product, we can simplify this to:

$$\begin{align*}\tau &= \overrightarrow{V}_P\times \overrightarrow{V}_P+ \overrightarrow{V}_P\times \overrightarrow{a}_P\\&=\overrightarrow{V}_P\times \overrightarrow{a}_P\end{align*}$$

This won't always get us the perfect vector \\(\overrightarrow{V}_P+\overrightarrow{a}_P\\)---the speed might be wrong---but it will turn the torpedo to a parallel vector. If this course is too fast or too slow, the new ZEM will allow the torpedo to make further corrections. In other words, the resulting turn will always be a step in the right direction.

This is the `HuntTarget` subroutine for 3D PN control with ZEM.

{% highlight c# %}
void HuntTarget()
{
    Vector3 relativemotion = targetRb.velocity - rb.velocity.magnitude*transform.forward; //relative velocity between torpedo and target
    Vector3 targetdirection = target.transform.position - transform.position; //vector from torpedo to target
    float targetDist = targetdirection.magnitude; //distance to target
    if (targetDist<detectionRange/3.3 & Vector3.Dot((target.transform.position-transform.position).normalized,transform.forward.normalized)>cosdetectionangle) //target is detected
    {
        float tgo = targetdirection.sqrMagnitude/Mathf.Max(Mathf.Abs(Vector3.Dot(relativemotion,targetdirection)),.1f); //calculate time to go
        Vector3 zem = targetdirection + relativemotion*tgo; //calculate orthogonal ZEM
        desiredRotation = Vector3.Cross(transform.forward,zem*(pnGain/Mathf.Clamp(tgo*tgo,10,.1f))); //rotate the torpedo based on orthogonal ZEM, scaling by a constant pnGain (N)
    }
    else
    {
        interceptPoint = target.transform.position; //drive towards the target's last known location
        target = null;
        targetRb = null;
    }
}
{% endhighlight %}

## Testing The Results

I compared the accuracy of each algorithm under different conditions, and the results were surprising! I'll write about the results, and the details of my test methods, next week.