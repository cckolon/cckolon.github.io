const defaults = {
    bikeweight : 26,
    humanweight : 155,
    wheeldiameter : 700, //mm
    optrpm : 120,
    maxpower : 150,
    frontalarea : 0.509,
    dragcoeff : 0.8,
    crr : 0.01,
    dtl: 3,
    airdensity : 1.225,
    grade : 0,
    headwind : 0,
    gearnum : 10,
    chainringteeth: 40,
    desiredrpm: 85,
    simulationtime : 60,
    initialspeed : 0,
    gears: [11, 13, 15, 18, 21, 24, 28, 32, 37, 46]
};

const timestep = .1; //seconds

var param = JSON.parse(JSON.stringify(defaults))

function updateValues(){
    param.bikeweight = parseFloat(document.getElementById("bikeweight").value);
    param.humanweight = parseFloat(document.getElementById("humanweight").value);
    param.wheeldiameter = parseFloat(document.getElementById("wheeldiameter").value);
    param.optrpm = parseFloat(document.getElementById("optrpm").value);
    param.maxpower = parseFloat(document.getElementById("maxpower").value);
    param.frontalarea = parseFloat(document.getElementById("frontalarea").value);
    param.dragcoeff = parseFloat(document.getElementById("dragcoeff").value);
    param.crr = parseFloat(document.getElementById("crr").value);
    param.dtl = parseFloat(document.getElementById("dtl").value);
    param.airdensity = parseFloat(document.getElementById("airdensity").value);
    param.grade = parseFloat(document.getElementById("grade").value);
    param.headwind = parseFloat(document.getElementById("headwind").value);
    param.chainringteeth = parseFloat(document.getElementById("chainringteeth").value);
    param.gearnum = document.getElementById("gearnum").value;
    param.desiredrpm = parseFloat(document.getElementById("desiredrpm").value);
    param.simulationtime = parseFloat(document.getElementById("simulationtime").value);
    param.initialspeed = parseFloat(document.getElementById("initialspeed").value);
    param.gears = []
    for (let i = 0; i<param.gearnum; i++) {
        if (document.getElementById("g"+i) != null) {
            param.gears[i] = parseFloat(document.getElementById("g"+i).value);
        }
        else {
            param.gears[i] = Math.max(...param.gears);
        }
    }
    param.gears.sort(function(a,b){return a-b});
    drawGearBox();
    draw_acceleration_profile(simulate_acceleration_profile(param.initialspeed/2.23694,param.simulationtime));
    draw_efficiency_data();
    update_gear_table();
    update_max_speeds();
}

function update_max_speeds() {
    ms = max_speed();
    document.getElementById("maxspeed").innerHTML = "Your current max speed is " + Math.round(ms[0]*100)/100 + " mph (gear: " + ms[1] + ").";
    ms = max_speed(humanweight = param.humanweight - 10);
    document.getElementById("maxspeedtenlbsless").innerHTML = "If you lost 10 lbs, your max speed would be " + Math.round(ms[0]*100)/100 + " mph (gear: " + ms[1] + ").";
    ms = max_speed(humanweight = param.humanweight, maxpower = param.maxpower + 10)
    document.getElementById("maxspeedtenwattsmore").innerHTML = "If your max power generation went up by 10 watts, your max speed would be " + Math.round(ms[0]*100)/100 + " mph (gear: " + ms[1] + ").";
    ms = max_speed(humanweight = param.humanweight, maxpower = param.maxpower, dragcoeff = param.dragcoeff - .1);
    document.getElementById("maxspeeddragless").innerHTML = "If you leaned over and reduced your drag coefficient by 0.1, your max speed would be " + Math.round(ms[0]*100)/100 + " mph (gear: " + ms[1] + ").";
}

function restoreDefaults(){
    param = JSON.parse(JSON.stringify(defaults));
    document.getElementById("bikeweight").value = defaults.bikeweight;
    document.getElementById("humanweight").value = defaults.humanweight;
    document.getElementById("wheeldiameter").value = defaults.wheeldiameter;
    document.getElementById("optrpm").value = defaults.optrpm;
    document.getElementById("maxpower").value = defaults.maxpower;
    document.getElementById("frontalarea").value = defaults.frontalarea;
    document.getElementById("dragcoeff").value = defaults.dragcoeff;
    document.getElementById("crr").value = defaults.crr;
    document.getElementById("dtl").value = defaults.dtl;
    document.getElementById("airdensity").value = defaults.airdensity;
    document.getElementById("grade").value = defaults.grade;
    document.getElementById("headwind").value = defaults.headwind;
    document.getElementById("chainringteeth").value = defaults.chainringteeth;
    document.getElementById("gearnum").value = defaults.gearnum;
    document.getElementById("desiredrpm").value = defaults.desiredrpm;
    document.getElementById("simulationtime").value = defaults.simulationtime;
    document.getElementById("initialspeed").value = defaults.initialspeed;
    drawGearBox();
    updateValues();
}

function drawGearBox(){
    var gearbox=document.getElementById("gearbox")
    for (let i=0; i<param.gearnum; i++) {
        if (document.getElementById("g"+i) == null) {
            var g = gearbox.appendChild(document.createElement('input'));
            g.setAttribute("id", "g"+i);
            g.setAttribute("type", "text");
            g.setAttribute("style", "width:3em")
            $('input:text[id=g'+i+']').change(updateValues);
            if (param.gears[i] != null) {
                g.value= param.gears[i];
            }
            else {
                g.value = Math.max(...param.gears);
            }
        }
        else {
            document.getElementById("g"+i).value = param.gears[i];
        }
    }
    for (let i=param.gearnum; document.getElementById("g" + i) != null; i++) {
        gearbox.removeChild(document.getElementById("g"+ i))
    }
}

function setChangeHandlers() {
    $('input:text[id=bikeweight]').change(updateValues);
    $('input:text[id=humanweight]').change(updateValues);
    $('input:text[id=wheeldiameter]').change(updateValues);
    $('input:text[id=optrpm]').change(updateValues);
    $('input:text[id=maxpower]').change(updateValues);
    $('input:text[id=frontalarea]').change(updateValues);
    $('input:text[id=dragcoeff]').change(updateValues);
    $('input:text[id=crr]').change(updateValues);
    $('input:text[id=dtl]').change(updateValues);
    $('input:text[id=airdensity]').change(updateValues);
    $('input:text[id=grade]').change(updateValues);
    $('input:text[id=headwind]').change(updateValues);
    $('input:text[id=chainringteeth]').change(updateValues);
    $('input:text[id=gearnum]').change(updateValues);
    $('input:text[id=desiredrpm]').change(updateValues);
    $('input:text[id=simulationtime]').change(updateValues);
    $('input:text[id=initialspeed]').change(updateValues);
}

function maxtorque(maxpower = param.maxpower, optrpm = param.optrpm) {
    return maxpower/(optrpm*2*Math.PI/60)*2;
}

function torque(rpm, maxpower = param.maxpower, optrpm = param.optrpm) {
    return maxtorque(maxpower = maxpower, optrpm = optrpm)*(1-rpm/(optrpm*2));
}

function gravforce(grade, mass) {
    return 9.81*Math.sin(Math.atan(grade/100))*mass;
}

function rollingresistance(grade, mass, crr) {
    return 9.81*Math.cos(Math.atan(grade/100))*mass*crr;
}

function drag(airspeed, dragcoeff, frontalarea, airdensity) {
    return 0.5*dragcoeff*frontalarea*airdensity*airspeed*Math.abs(airspeed);
}

function forwardforce(leg_torque, dtl, chainringteeth, gearteeth, wheeldiameter) {
    return Math.max(0,leg_torque*(1-dtl/100)*2*gearteeth/(wheeldiameter/1000*chainringteeth))
}

function rpm_from_speed(speed, chainringteeth, gearteeth, wheeldiameter) {
    var mod = wheeldiameter*chainringteeth/gearteeth*Math.PI; // meters of development for this gear
    return 60*speed/mod;
}

function vo2(power, body_mass, rpm) {
    return 3.5+10.8*power/body_mass+0.0000076*rpm**3;
}

function optimalgear(speed, chainringteeth, gears, wheeldiameter, desiredrpm) {
    for (let i=1; i<gears.length; i++) {
        let rpm_diff = rpm_from_speed(speed, chainringteeth, gears[i], wheeldiameter) - desiredrpm;
        if (rpm_diff > 0) {
            if (Math.abs(rpm_from_speed(speed, chainringteeth, gears[i-1], wheeldiameter) - desiredrpm)<rpm_diff) {
                return i; // the previous gear is the optimal one
            } else {
                return i+1; // the current gear is the optimal one
            }
        }
    }
    return gears.length;
}

function max_speed(
    humanweight = param.humanweight,
    maxpower = param.maxpower,
    dragcoeff = param.dragcoeff,
    chainringteeth = param.chainringteeth,
    gears = param.gears,
    wheeldiameter = param.wheeldiameter, 
    bikeweight = param.bikeweight,
    grade = param.grade,
    crr = param.crr,
    headwind = param.headwind,
    frontalarea = param.frontalarea,
    airdensity = param.airdensity,
    dtl = param.dtl,
    desiredrpm = param.desiredrpm)
    {
    let a_step = 1;
    let last_acceleration = 1;
    let speed = 0;
    let gear = 1;
    let i = 0;
    while (Math.abs(a_step) > 0.0001 & i < 1000) {
        i ++;
        last_acceleration = a_step;
        newgear = optimalgear(speed, chainringteeth, gears, wheeldiameter/1000, desiredrpm);
        [a_step, , , , , ] =
        calculate_acceleration(
            speed,
            newgear,
            maxpower = maxpower,
            chainringteeth = chainringteeth,
            gears = gears,
            wheeldiameter = wheeldiameter, 
            bikeweight = bikeweight,
            humanweight = humanweight, 
            grade = grade,
            crr = crr,
            headwind = headwind,
            dragcoeff = dragcoeff,
            frontalarea = frontalarea,
            airdensity = airdensity,
            dtl = dtl);
        if (last_acceleration < 0 | a_step > 0) {
            gear = newgear; // only change gears if the new acceleration is positive
        }
        else {
            [a_step, , , , , ] =
            calculate_acceleration(
                speed,
                gear,
                maxpower = maxpower,
                chainringteeth = chainringteeth,
                gears = gears,
                wheeldiameter = wheeldiameter, 
                bikeweight = bikeweight,
                humanweight = humanweight, 
                grade = grade,
                crr = crr,
                headwind = headwind,
                dragcoeff = dragcoeff,
                frontalarea = frontalarea,
                airdensity = airdensity,
                dtl = dtl); // keep gears the same and recalculate
        }
        speed += a_step;
    }
    return [speed*2.23694, gears.length - gear + 1];
}


function calculate_acceleration(
    speed, // in m/s
    gear, // a number from 1 to num_gears (1 indexed, inclusive)
    maxpower = param.maxpower,
    chainringteeth = param.chainringteeth,
    gears = param.gears,
    wheeldiameter = param.wheeldiameter, 
    bikeweight = param.bikeweight,
    humanweight = param.humanweight, 
    grade = param.grade,
    crr = param.crr,
    headwind = param.headwind,
    dragcoeff = param.dragcoeff,
    frontalarea = param.frontalarea,
    airdensity = param.airdensity,
    dtl = param.dtl)
    {
    var foot_rpm = rpm_from_speed(speed, chainringteeth, gears[gear-1], wheeldiameter/1000);
    var leg_torque = torque(foot_rpm, maxpower = maxpower);
    var total_mass = (bikeweight+humanweight)*0.453592;
    var fforce = forwardforce(leg_torque, dtl, chainringteeth, gears[gear-1], wheeldiameter);
    var gforce = gravforce(grade, total_mass);
    var rrforce = rollingresistance(grade, total_mass, crr);
    var dforce = drag(speed + headwind/2.23694, dragcoeff, frontalarea, airdensity);
    var net_force = fforce - gforce - rrforce - dforce;
    return [net_force/total_mass, foot_rpm, fforce, gforce, rrforce, dforce];
}

function simulate_acceleration_profile(initial_speed, sim_time) {
    gear = optimalgear(initial_speed, param.chainringteeth, param.gears, param.wheeldiameter/1000, param.desiredrpm);
    var speed = initial_speed;
    var acceleration_array = [];
    var gear_array = [];
    var speed_array = [];
    var rpm_array = [];
    var fforce_array = [];
    var gforce_array = [];
    var rrforce_array = [];
    var dforce_array = [];
    var time_array = [];
    for (t=0; t< sim_time; t+=timestep) {
        newgear = optimalgear(speed, param.chainringteeth, param.gears, param.wheeldiameter/1000, param.desiredrpm);
        var [a, rpm, fforce, gforce, rrforce, dforce]= calculate_acceleration(speed, newgear);
        if (acceleration_array[acceleration_array.length-1] < 0 | a > 0) {
            gear = newgear; // only change gears if the acceleration is in the same direction
        }
        else {
            var [a, rpm, fforce, gforce, rrforce, dforce]= calculate_acceleration(speed, gear); // keep gears the same and recalculate
        }
        time_array.push(t);
        acceleration_array.push(a);
        gear_array.push(param.gearnum-gear+1);
        speed_array.push(speed*2.23694); // m/s to mph
        rpm_array.push(rpm);
        fforce_array.push(fforce);
        gforce_array.push(gforce);
        rrforce_array.push(rrforce);
        dforce_array.push(dforce);
        speed += a*timestep;
    }
    return [time_array, acceleration_array, gear_array, speed_array, rpm_array, fforce_array, gforce_array, rrforce_array, dforce_array];
}

function update_gear_table() {
    const gear_table = document.getElementById('GearTable');
    gear_table.innerHTML = '';
    var gear_row = document.createElement('tr');
    gear_table.appendChild(gear_row);
    var gear_header = document.createElement('th');
    gear_header.innerHTML = 'Gear';
    gear_row.appendChild(gear_header);
    var gear_ratio_header = document.createElement('th');
    gear_ratio_header.innerHTML = 'Gear Ratio';
    gear_row.appendChild(gear_ratio_header);
    for (i=0; i<param.gearnum; i++) {
        var gear_row = document.createElement('tr');
        var gear_num = document.createElement('td');
        gear_num.innerHTML = param.gearnum-i;
        gear_row.appendChild(gear_num);
        var gear_ratio = document.createElement('td');
        gear_ratio.innerHTML = Math.round(param.chainringteeth/param.gears[i]*100)/100;
        gear_row.appendChild(gear_ratio);
        gear_table.appendChild(gear_row);
    }
}

function draw_acceleration_profile(array_array) {
    const charts_object = document.getElementById('AccelerationProfile');
    charts_object.innerHTML = '';
    var chart_object = document.createElement('canvas');
    charts_object.appendChild(chart_object);
    var time_array = [];
    for (i in array_array[0]) {
        time_array.push(Math.round(array_array[0][i]*10)/10)
    }
    const accelerationchart = new Chart(chart_object, {
        type: 'line',
        data: {
            labels: time_array,
            label: 'Time (s)',
            responsive: true,
            datasets: [{
                label: 'Acceleration (m/s^2)',
                data: array_array[1],
                pointRadius : 0,
                yAxisID: 'y1'
            },
            {
                label: 'Speed (mph)',
                data: array_array[3],
                pointRadius : 0,
                yAxisID: 'y2'
            },
            {
                label: 'Gear',
                data: array_array[2],
                pointRadius : 0,
                yAxisID: 'y3'
            },
            {
                label: 'Cadence (RPM)',
                data: array_array[4],
                pointRadius : 0,
                yAxisID: 'y4'
            },
        ]
        },
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        beforeTitle: function(context) {
                            return 'Time: ' + context[0].label + ' s';
                        },
                        title: function(context) {
                            return ''
                        }
                    }
                }
            },    
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                x : {
                    title: {
                        text : 'Time (s)',
                        display: true
                    }
                },
                y1: {
                    title : {
                        text : 'Acceleration (m/s^2)',
                        display : true
                    },
                    position: 'left',
                },
                y2: {
                    title : {
                        text : 'Speed (mph)',
                        display : true
                    },
                    position: 'left',
                    grid: {
                        drawOnChartArea: false,
                    },
                },
                y3: {
                    title : {
                        text : 'Gear',
                        display : true
                    },
                    position: 'right',
                    max: Math.round(param.gearnum),
                    min: 1,
                    grid: {
                        drawOnChartArea: false,
                    },
                },
                y4: {
                    title : {
                        text : 'Cadence (RPM)',
                        display : true
                    },
                    position: 'right',
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            }
        }
    });
    chart_object = document.createElement('canvas');
    charts_object.appendChild(chart_object);
    var power_array = [[],[],[],[],[],[]];
    for (i=0; i < array_array[0].length; i++) {
        power_array[0].push(array_array[3][i]*array_array[5][i]/(1-param.dtl/100)*0.44704);
        power_array[1].push(-array_array[3][i]*array_array[6][i]*0.44704);
        power_array[2].push(-array_array[3][i]*array_array[7][i]*0.44704);
        power_array[3].push(-array_array[3][i]*array_array[8][i]*0.44704);
        power_array[4].push(array_array[3][i]*array_array[5][i]*(1-1/(1-param.dtl/100))*0.44704);
        power_array[5].push(power_array[0][i]+power_array[1][i]+power_array[2][i]+power_array[3][i]+power_array[4][i]);
        // input power, gravitational power, rolling resistance power, drag power, drive train loss power all in watts (transform mph to m/s), last column is total power
    }
    //determine the max of every element in power array (with stacking)
    var max_power = 0;
    for (i=0; i< power_array[0].length; i++) {
        var pos_sum = 0;
        var neg_sum = 0;
        for (j=0; j< power_array.length-1; j++) {
            if (power_array[j][i] < 0) {
                neg_sum += power_array[j][i];
            }
            else {
                pos_sum += power_array[j][i];
            }
        }
        if (Math.max(-neg_sum,pos_sum) > max_power) {
            max_power = Math.max(-neg_sum,pos_sum);
        }
    }
    const powerchart = new Chart(chart_object, {
        type: 'line',
        data: {
            labels: time_array,
            responsive: true,
            ticks: {
                stepSize: 10,
            },
            datasets: [{
                label: 'Input Power (W)',
                data: power_array[[0]],
                pointRadius : 0,
                yAxisID: 'y1',
                order: 5,
                fill: true,
                backgroundColor: 'rgb(73, 162, 235)',
                borderColor: 'rgba(0,0,0,0)',
            },
            {
                label: 'Gravitational Power (W)',
                data: power_array[1],
                pointRadius : 0,
                yAxisID: 'y1',
                order: 2,
                fill: true,
                backgroundColor: 'rgb(247, 96, 129)',
                borderColor: 'rgba(0,0,0,0)',
            },
            {
                label: 'Rolling Resistance Power (W)',
                data: power_array[2],
                pointRadius : 0,
                yAxisID: 'y1',
                order: 3,
                fill: true,
                backgroundColor: 'rgb(92, 192, 193)',
                borderColor: 'rgba(0,0,0,0)'
            },
            {
                label: 'Drag Power (W)',
                data: power_array[3],
                pointRadius : 0,
                yAxisID: 'y1',
                order: 1,
                fill: true,
                backgroundColor: 'rgb(249, 158, 61)',
                borderColor: 'rgba(0,0,0,0)'
            },
            {
                label: 'Drive Train Loss Power (W)',
                data: power_array[4],
                pointRadius : 0,
                yAxisID: 'y1',
                order: 4,
                fill: true,
                backgroundColor: 'rgb(153, 102, 255)',
                borderColor: 'rgba(0,0,0,0)',
            },
            {
                label: 'Net Power (W)',
                data: power_array[5],
                pointRadius : 0,
                yAxisID: 'y2',
                order: 0,
                borderColor: 'rgb(0,0,0)',
                backgroundColor: 'rgb(0,0,0)',
            }
        ]
        },
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        beforeTitle: function(context) {
                            return 'Time: ' + context[0].label + ' s';
                        },
                        title: function(context) {
                            return ''
                        }
                    }
                }
            },    
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                x : {
                    title: {
                        text: 'Time (s)',
                        display: true
                    }
                },
                y1: {
                    display: true,
                    position: 'left',
                    stacked: true,
                    max: parseFloat((max_power*1.1).toPrecision(2)),
                    min: -parseFloat((max_power*1.1).toPrecision(2))
                },
                y2: {
                    display: false,
                    max: parseFloat((max_power*1.1).toPrecision(2)),
                    min: -parseFloat((max_power*1.1).toPrecision(2))
                }
            }
        }
    });
}

function draw_efficiency_data() {
    const charts_object = document.getElementById('EfficiencyData');
    charts_object.innerHTML="";
    var chart_object = document.createElement('canvas');
    charts_object.appendChild(chart_object);
    var torque_array = [];
    var power_array = [];
    var rpm_array = [];
    for (rpm = 0; rpm < param.optrpm*2; rpm += 1) {
        torque_array.push(torque(rpm));
        power_array.push(torque(rpm)*rpm*Math.PI/30);
        rpm_array.push(rpm);
    }
    const efficiencychart = new Chart(chart_object, {
        type: 'line',
        data: {
            labels: rpm_array,
            responsive: true,
            datasets: [{
                label: 'Torque (Nm)',
                data: torque_array,
                pointRadius : 0,
                yAxisID: 'y1',
            },
            {
                label: 'Power (W)',
                data: power_array,
                pointRadius : 0,
                yAxisID: 'y2',
            }]
        },
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        beforeTitle: function(context) {
                            return 'Cadence: ' + context[0].label + ' RPM';
                        },
                        title: function(context) {
                            return ''
                        }
                    }
                }
            },
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                x: {
                    title: {
                        text: 'Cadence (RPM)',
                        display: true,
                    }
                },
                y1: {
                    title: {
                        text: 'Torque (Nm)',
                        display: true,
                    },
                    position: 'left',
                },
                y2: {
                    title: {
                        text: 'Power (W)',
                        display: true,
                    },
                    position: 'right',
                }
            }
        }
    });
}

$(document).ready(
    function() {
        restoreDefaults();
        setChangeHandlers();
        updateValues();
    }
);