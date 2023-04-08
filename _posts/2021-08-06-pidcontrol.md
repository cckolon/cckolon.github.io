---
layout: post
title: Moving Fake Objects with Fake Forces
excerpt_separator: <!--more-->
image: /assets/media/hillcontrol.png
description: Using PID control to move a submarine with physics in Unity.
---

When I tried to design a movement controller for a submarine in Unity, I felt up to the challenge. After all, exerting forces on objects is my main way of interacting with the world. [I've written previously about my submarine game project](/2021/04/25/navwithfractals.html); essentially, I'm making a fun little game, inspired by my personal experience, where you drive a submarine around, hunt other submarines, dodge torpedos, etc. The game was never supposed to be a faithful representation of real life, it's just for fun. <!--more-->

## The Real World

In real life, submarines move using a number of dedicated control surfaces. The propeller (or propulsor on the Virginia class) provides forward thrust to push the submarine through the water. The rudder allows the submarine to yaw from side to side. These are analogous to the engines and rudder of a surface ship, or airplane.

For buoyancy, the submarine has ballast tanks and trim tanks. Ballast tanks are binary: either flooded (full of water) or blown (full of air). To dive the ship, the ballast tanks are vented, which allows air to escape, filling the tanks with water through grates below the waterline. [Here's a great video](https://www.youtube.com/watch?v=cTyWsBXp8gI). When the submarine surfaces, the water is blown out of the tanks to keep the submarine from sinking back down again. In an emergency (like flooding), the submarine can quickly fill the tanks with air to float to the surface. This is famously known as an "[Emergency Blow](https://www.youtube.com/watch?v=rujJqZpexBU&ab_channel=WilWatkins)". 

To finely adjust weight without surfacing, submarines have trim tanks. Trim tanks allow the crew to ingest or pump off smaller amounts of water. Changes in salinity and temperature affect the density of the surrounding water, and cause the submarine's buoyancy to change. Also, as the submarine dives deeper, the hull compresses, displacing less water and lowering the buoyant force. Without compensating for these changes, the submarine can end up denser than the surrounding water, causing a "sink out", or lighter than the surrounding water, causing a broach (unintentional surface). The ship control party meticulously tracks the submarine's buoyancy, and moves water into and out of the trim tanks to compensate.

Finally, the submarine controls its attitude with bow planes and stern planes. These are elevator-like control surfaces, which can be used to pitch the submarine up and down. This is the main way to control depth: the submarine points in a direction and drives there.

## Naive Implementation

I decided that, in the game, I wanted physics to look fairly realistic. To move or rotate the submarine, I didn't want to just set the object's position or rotation manually. Instead, I wanted to apply forces and torques to the submarine. That way, I wouldn't have any "snappy" motions, which would kill realism. Plus, if the submarine collides with the bottom, or gets blown up by a torpedo, I want it to look like a real-life collision.

So at first, I tried the simplest approach to angle control. The player would apply a control signal for the keyboard, setting the desired angle. Then, the computer would apply a torque to the boat depending on how far it was from the desired angle, pitching it in the right direction. This is known in control systems as [proportional control](https://en.wikipedia.org/wiki/Proportional_control).

{% highlight c# %}
void PhysicsMove()
{
    float pitcherror = (-transform.rotation.eulerAngles.x - orderedpitch + 540)%360 - 180;
​    float rollerror = (-transform.rotation.eulerAngles.z - rudder + 540)%360 - 180;
​    rb.AddForce(transform.forward*(float)bell*.01f*topspeed);
​    rb.AddTorque(transform.up *rudder*(float)bell*turnSpeed + transform.right*pitcherror*pitchSpeed + transform.forward*rollerror*rollSpeed);
​    sternplanes.transform.rotation = Quaternion.RotateTowards(sternplanes.transform.rotation,transform.rotation*Quaternion.Euler(90-Mathf.Clamp(pitcherror*5,-30,30),0,0),30f*Time.fixedDeltaTime);
​    rudderobj.transform.rotation = Quaternion.RotateTowards(rudderobj.transform.rotation,transform.rotation*Quaternion.Euler(0,90-Mathf.Clamp(rudder,-30,30),90),30f*Time.fixedDeltaTime); 
}
{% endhighlight %}

`rb` is the submarine's [rigidbody](https://docs.unity3d.com/ScriptReference/Rigidbody.html), which I initialize earlier in the program.

Pitch and roll error (the distance from desired values) would be calculated first. A thrust force, based on ordered speed, would be applied. Then, the algorithm would apply a torque around the forward axis and the left/right axis to control roll and pitch respectively, based on each error. Rudder torque was constant depending on the ordered rudder angle. Finally, the last two lines rotate the stern planes and rudder, so the ship looks like it is turning.

The algorithm worked okay, but there were some issues. Sometimes, there would be persistent errors, where real pitch or roll would never reach the ordered value. Also, the submarine tended to [oscillate around the desired pitch or roll](https://en.wikipedia.org/wiki/Hunting_oscillation), which looks unrealistic and a little sickening.

![Hunting in proportional control](/assets/media/pinstability.gif){: .center-image}

The submarine is acting similarly to a [damped harmonic oscillator](https://en.wikipedia.org/wiki/Harmonic_oscillator#Damped_harmonic_oscillator), damped by the angular friction of the physics engine. It would be possible (I think) to vary the torque magnitude to eliminate the oscillations ([critically damp](https://en.wikipedia.org/wiki/Damping) the system), but this gives us no control over the submarine's pitch rate: we would have to choose the rate that gave us a damping ratio of 1. 

## Manual Damping

To try and control oscillations, I could apply another feedback signal based on the submarine's angular velocity, manually damping the submarine's motion. The program was very similar to my first implementation, but this time I would calculate the angular velocity first, and subtract it from each error signal after multiplying it by a coefficient. Through trial and error, I found that the coefficients of 200 and 10 worked well for pitch and roll respectively. This is the new error calculation.

{% highlight c# %}
    Vector3 angvel = rb.angularVelocity;
    float pitcherror = (-transform.rotation.eulerAngles.x - orderedpitch + 540)%360 - 180 - angvel.x*200;
​    float rollerror = (-transform.rotation.eulerAngles.z - rudder + 540)%360 - 180 - angvel.z*10;
{% endhighlight %}

This largely eliminated the oscillations, but it led to a weirder problem. When pitching and rolling simultaneously, the submarine could suddenly become unstable.

![Damped Instability](/assets/media/subinstability.gif){: .center-image}

Even if it was remaining inside of its normal limits, sometimes the submarine would fail to reach the desired angle, even after a prolonged period. You can see this by the discrepancy between the red (ordered angle) and white (actual angle) needles on the left. 

![Offset](/assets/media/suboffset.gif){: .center-image}

So I couldn't use this method. I just couldn't trust it! At this point, I faced two options. There was the mathematical way of solving this problem: figure out what is actually going on, and spend a lot of time trying to solve it elegantly. There is also the engineering way: use a well-studied method that will probably work.

## PID Control

First, I looked at the engineering way. I took a semester of control systems in college, and I remembered studying proportional-integral-derivative (PID) controllers. This seemed like a good application, so I opened up the [Wikipedia article](https://en.wikipedia.org/wiki/PID_controller) and got to work.

A PID controller tries to minimize an *error function*, \\(e(t)\\). The insight behind PID control is that the value, integral, and derivative of \\(e(t)\\) are all useful in determining the desired control signal. A commonly-discussed application of PID control is cruise control on a car.

* On a flat road, a controller should open the throttle if the car is too slow, and shut it if the car is too fast. This action is driven by the proportional response of the controller: the error itself.
* If the car starts to ascend a hill, its speed will start to decrease. Seeing this, the controller should preemptively open the throttle in order to prevent the speed from dropping too much. This action is driven by the derivative response: the rate of change of error. It is also called *anticipatory control*.
* As the car continues up the hill, there may be a steady-state error, since it takes more engine power to maintain the same speed. Over time, the controller should see that the current speed is insufficient, and open throttles farther to compensate. This action is driven by the integral response: the "area under the curve" of the error.

![Cruise Control on a Hill](/assets/media/hillcontrol.png){: .center-image}

In this case, \\(e(t)\\) is a simple function: the desired speed minus the actual speed. The *control function* \\(u(t)\\) is the position of the throttle. The control function is calculated from the error function by the following equation:
\\[u(t) = K_p e(t) + K_i \int_0^t e(\tau) \mathrm{d}\tau + K_d e'(t)\\]
The three \\(K\\)s are nonnegative constants which govern the behavior of the control function. Adjusting these constants is known as 'tuning' the controller. The optimal value of the constants depends on the *system*, not the controller, so PID controllers must be tuned differently for different applications. Usually this starts with some baseline guess of what the constants should be, and then requires trial and error to perfect. [There are also systematic ways to do it](https://en.wikipedia.org/wiki/PID_controller#Overview_of_tuning_methods).

Fun fact: PID control was first invented for ship steering---this exact application! Some old-school PID controllers were [tuned with actual knobs](https://en.wikipedia.org/wiki/PID_controller#/media/File:Pneumatische_regelaar.jpg) to manually change the constants. 

For my application, the error function \\(e(t)\\) was the difference between the desired and actual pitch and roll of the submarine, and the control function \\(u(t)\\) was the torque I would apply to the submarine. It's worth mentioning that \\(e(t)\\) and \\(u(t)\\) are three-dimensional vectors, since they measure the submarine's rotation using [Euler angles](https://en.wikipedia.org/wiki/Euler_angles). A two-dimensional vector would suffice, because the \\(y\\) term is always zero, but a three-dimensional one is more convenient for applying the torque later.
 The physics in the game is calculated in time steps, at a fixed update rate. Knowing this, I would apply the following, discrete-time version of the control equation.

$$\begin{aligned}u(t) &= K_p e(t) + K_i E(t) + K_d \left(\frac{e(t)-e(t-\Delta t)}{\Delta t}\right)\\
E(t) &= E(t-\Delta t) + e(t)\end{aligned}$$

Here's how I implemented this in code:

{% highlight c# %}
void AnglePID()
{
    Vector3 angleError = new Vector3(pitchSpeed*(-orderedpitch-(transform.eulerAngles.x+180)%360+180),0,rollSpeed*(-rudder-(transform.eulerAngles.z+180)%360+180));
    angleI = angleI + angleError*Time.fixedDeltaTime;
    Vector3 angleD = (angleError - lastAngleError)/Time.fixedDeltaTime;
    lastAngleError = angleError;
    Vector3 angleSignal = angleError*coeffP+angleI*coeffI+angleD*coeffD;
    if (angleI.magnitude > maxI)
    {
        angleI = angleI.normalized*maxI;
    }
    if (angleSignal.magnitude > maxAngleTorque)
    {
        angleSignal = angleSignal.normalized*maxAngleTorque;
    }
    rb.AddRelativeTorque(angleSignal);
    rb.AddForce(transform.forward*(float)bell*.01f*topspeed);
    rb.AddTorque(transform.up *rudder* transform.InverseTransformVector(rb.velocity).z);
    sternplanes.transform.rotation = Quaternion.RotateTowards(sternplanes.transform.rotation,transform.rotation*Quaternion.Euler(90-Mathf.Clamp(angleSignal.x*5,-30,30),0,0),30f*Time.fixedDeltaTime);
    rudderobj.transform.rotation = Quaternion.RotateTowards(rudderobj.transform.rotation,transform.rotation*Quaternion.Euler(0,90-Mathf.Clamp(rudder,-30,30),90),30f*Time.fixedDeltaTime);
}
{% endhighlight %}

This program calculates the angle error, a three-dimensional vector. Then it calculates the derivative and integral approximations by the equations above. I implemented two constraints on the algorithm. I added a maximum value, `maxI` for the integral, so that its [magnitude would not become excessive](https://en.wikipedia.org/wiki/Integral_windup). I also used a maximum value of the torque which could be applied to the submarine, `maxAngleTorque`, so it would behave realistically and not apply arbitrarily large torques. Finally, I actually applied the torque to the submarine, as well as the normal propulsor and rudder forces.

I tuned it using [this helpful article](https://www.codeproject.com/Articles/36459/PID-process-control-a-Cruise-Control-example), which has several examples of good and bad tuning. I came up with the following constants:

$$\begin{aligned}
K_p &= 1\\
K_i &= .2\\
K_d &= 2\end{aligned}$$

Finally, I had control. No crazy overshoots or instability.

![PID Control](/assets/media/stablepid.gif){: .center-image}

## The Math

This approach works, so I guess I should be satisfied, but I still felt like the problem wasn't fully solved. The big issue, the thing that had messed up my earlier control schemes, was that a rotation along one axis affects rotations along the other axes. I wanted to factor that into the controller, so it would not be 'surprised' when one rotation affected another.

You can start to see the problem when you compare the linear and rotational equations of motion for a rigid body. Linearly, we have the nice, simple Newton's second law equation:

$$F=ma$$

Compare this to [the rotational version](https://en.wikipedia.org/wiki/Euler%27s_equations_(rigid_body_dynamics)):

$$\tau = I_R\alpha + \omega\times I_R\omega$$

Here \\(\tau\\) is the torque, \\(\alpha\\) is the angular acceleration, \\(\omega\\) is the angular velocity, and \\(I_R\\) is a real, symmetric 3-by-3 matrix called the *inertia tensor*, which is conceptually similar to the mass. The first term is fairly similar to the \\(ma\\) of Newton's second law, but the second term is new. We can see an important insight if we set \\(\tau\\) equal to zero:

$$\alpha = - I_R^{-1}\left(\omega\times I_R\omega\right)$$

For a rotating body, [there can be angular acceleration even without any torque](https://en.wikipedia.org/wiki/Precession#:~:text=Torque%2Dfree%20precession%20implies%20that,vector%20changes%20orientation%20with%20time.)! This is one of the key differences between angular and linear motion. Don't believe me? [Check this out](https://en.wikipedia.org/wiki/Tennis_racket_theorem).

![Tennis Racket Theorem](/assets/media/tennisracket.gif){: .center-image}

\\(I_R\\) can be diagonalized into a matrix \\(\Lambda\\) by a rotation matrix \\(Q\\). The columns of \\(Q\\) are the *principal axes* of the body, and the diagonal entries of \\(\Lambda\\) are its *principal moments*.

$$\begin{aligned}
I_R &= Q\Lambda Q^T\\
&= \begin{pmatrix}
v_1 & v_2 &v_3
\end{pmatrix}
\begin{pmatrix}
I_1 & 0 & 0\\
0 & I_2 & 0\\
0 & 0 & I_3
\end{pmatrix}
\begin{pmatrix}
v_1 \\ v_2 \\v_3
\end{pmatrix}
\end{aligned}$$

This is how Unity calculates moments. Each rigid body has an inertia tensor, corresponding to \\(\Lambda\\), and an inertia tensor rotation, corresponding to \\(Q\\). Rather than a diagonal matrix, the inertia tensor is stored as a three dimensional vector of the diagonal elements:

$$\begin{pmatrix}
I_1\\I_2\\I_3
\end{pmatrix}$$

Unity uses [quaternions](https://en.wikipedia.org/wiki/Quaternion) for rotation, so \\(Q\\) is stored as a quaternion. In the in-game inspector, the Euler angles are displayed to make it easier to read. 

This was my submarine's inertia tensor and rotation:

![Inertia](/assets/media/inertia.png){: .center-image}

You might notice that the inertia tensor rotation is really close to the identity (zero) rotation. In other words, the x, y, and z axes were almost the submarine's principal axes. This kind of makes sense, since the submarine has a lot of symmetry about those axes (although the sail is problematic).

At this point, I could convert my desired acceleration to torque using the rotational equation of motion, and then apply it to the rigid body. There's an easier way, though. [Unity allows you to edit the inertia tensor rotation directly](https://docs.unity3d.com/ScriptReference/Rigidbody-inertiaTensorRotation.html). Since it's close enough to the identity rotation, we can make it exactly the identity rotation and save ourselves a big matrix calculation. We do this by adding the following code to the `Start` subroutine.

{% highlight c# %}
rb.inertiaTensorRotation = Quaternion.identity;
{% endhighlight %}

This simplifies the torque equation to:

$$\tau = \begin{pmatrix}I_1\\I_2\\I_3\end{pmatrix}\circ\alpha + \omega\times\left(\begin{pmatrix}I_1\\I_2\\I_3\end{pmatrix}\circ\omega\right)$$

Where \\(\circ\\) denotes the [elementwise (Hadamard) product](https://en.wikipedia.org/wiki/Hadamard_product_(matrices)).

Since we want to control the angular acceleration, we can substitute \\(\alpha\\) for our output function \\(u(t)\\). Unity lets us use the `Vector3.Scale` operation to perform the Hadamard product. So calculating \\(\tau\\) in code looks like this:

{% highlight c# %}
Vector3 torqueSignal = Vector3.Scale(rb.inertiaTensor.normalized, angleSignal) + Vector3.Cross(rb.angularVelocity,Vector3.Scale(rb.inertiaTensor.normalized,rb.angularVelocity));
{% endhighlight%}

I normalize the inertia tensor because its magnitude is, like, 500, and the relative magnitude is all that matters anyway. The full subroutine now looks like this:

{% highlight c# %}
void AnglePID()
{
    Vector3 angleError = new Vector3(pitchSpeed*(-orderedpitch-(transform.eulerAngles.x+180)%360+180),0,rollSpeed*(-rudder-(transform.eulerAngles.z+180)%360+180));
    angleI = angleI + angleError*Time.fixedDeltaTime;
    Vector3 angleD = (angleError - lastAngleError)/Time.fixedDeltaTime;
    lastAngleError = angleError;
    Vector3 angleSignal = angleError*coeffP+angleI*coeffI+angleD*coeffD;
    Vector3 torqueSignal = Vector3.Scale(rb.inertiaTensor.normalized, angleSignal) + Vector3.Cross(rb.angularVelocity,Vector3.Scale(rb.inertiaTensor.normalized,rb.angularVelocity));
    if (angleI.magnitude > maxI)
    {
        angleI = angleI.normalized*maxI;
    }
    if (torqueSignal.magnitude > maxAngleTorque)
    {
        torqueSignal = torqueSignal.normalized*maxAngleTorque;
    }
    rb.AddRelativeTorque(torqueSignal);
    rb.AddForce(transform.forward*(float)bell*.01f*topspeed);
    rb.AddTorque(transform.up *rudder*turnSpeed* transform.InverseTransformVector(rb.velocity).z);
    sternplanes.transform.rotation = Quaternion.RotateTowards(sternplanes.transform.rotation,transform.rotation*Quaternion.Euler(90-Mathf.Clamp(angleSignal.x*5,-30,30),0,0),30f*Time.fixedDeltaTime);
    rudderobj.transform.rotation = Quaternion.RotateTowards(rudderobj.transform.rotation,transform.rotation*Quaternion.Euler(0,90-Mathf.Clamp(rudder,-30,30),90),30f*Time.fixedDeltaTime);
}
{% endhighlight%}

And now, finally, I can move the submarine around and feel good about it.

![Nirvana](/assets/media/nirvana.gif){: .center-image}