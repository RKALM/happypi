const express = require('express')
//Thingy
var Thingy = require('./index2');
var led_color = 1;
//Misc
var request = require('request');
var util = require('util');
const app = express()
const port = 3000
var displayGasMsg = "No gas feedback yet!"
var maker_key = 'j2eqWrlFER7ngphU4IUTDmYD7QNigvN_mqXCg36Kd0L';
var BASE_URL = 'https://maker.ifttt.com/trigger/%s/with/key/%s';
var sdata = new Object(); //for sending the data somewhere as a json
//HS100
const { Client } = require('tplink-smarthome-api');
const client = new Client();
//Motion sensor motion.js
require('console.table');
var enabled;
var msgTap = "No Tap data yet";
var msgOrientation = "No Orientation data yet";
var msgQuaternion = "No Quaternion data yet";
var msgStepCounter = "No StepCounter data yet";
var msgEuler = "No Euler data yet";
var msgHeading = "No Heading data yet";
var msgGravity = "No Gravity data yet";

app.get('/', (req, res) => {
  let msg = pageGenerator("index", req, res); //generates a page dynamically.
  res.write(msg);
})

//Turning the HS100 on and off!
app.get('/hs100onoff', (req, res) => {
  hs100OnOff();
  //res.send('Hello HS100!')
  let msg = pageGenerator("index", req, res); //generates a page dynamically.
  res.write(msg);
})

//Turning the HS100 on and off from another page. The "s" in the beginning stands for "server"
app.get('/shs100onoff', (req, res) => {
    hs100OnOff();
    res.send('Hello HS100!')
  })

//Turning the Nettio on and off!
app.get('/nettioonoff', (req, res) => {
  //hs100OnOff();
  //res.send('Hello HS100!')
  boopTheIFTTT('onoff'); //it makes the Nettio plug 1 to go on and off
  let msg = pageGenerator("index", req, res); //generates a page dynamically.
  res.write(msg);
})

//Turning the Nettio on and off from another page. The "s" in the beginning stands for "server
app.get('/snettioonoff', (req, res) => {
    //hs100OnOff();
    boopTheIFTTT('onoff'); //it makes the Nettio plug 1 to go on and off
    res.send('Hello Nettio!')
  })

//Changing the color of the LED
app.get('/toggleledcolor', (req, res) => {
  toggleLedColor();
  let msg = pageGenerator("index", req, res); //generates a page dynamically.
  res.write(msg);
})

//Changing the color of the LED from another page. The "s" in the beginning stands for "server
app.get('/stoggleledcolor', (req, res) => {
    toggleLedColor();
    res.send('Hello LED!')
  })

//Changing the motion sensor on/off
app.get('/motionsensor', (req, res) => {
  activateMotion2();
  let msg = pageGenerator("index", req, res); //generates a page dynamically.
  res.write(msg);
})

//Changing the motion sensor on/off from another page. The "s" in the beginning stands for "server
app.get('/smotionsensor', (req, res) => {
    activateMotion2();
    res.send('Hello Motion sensor!')
})


//delivering the thingy data to another page. The "s" in the beginning stands for "server
app.get('/sdata', (req, res) => {
    res.send(JSON.stringify(sdata));
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


//Dynamic generation of a page
//===================== Page Generation ================================
function pageGenerator(pagename, req, res){
  var title = "";
  if(pagename == "index"){
      title = "IoT Lab";
  } else {
      title = pagename;
  }
  msg1="";
  msg1 = msg1 + "<head>";
  msg1 = msg1 + "<title>Welcome to " + title + "</title>";
  msg1 = msg1 + '<LINK href="style.css" rel="stylesheet" type="text/css">';
  msg1 = msg1 + "</head><body>";
  msg1 = msg1 + "<h1>Welcome to the " + title + "</h1>";
  msg1 = msg1 + "<ul>";
  msg1 = msg1 + "<li>Gas: " + displayGasMsg + "</li>";
  msg1 = msg1 + "<li>Tap: " + msgTap + "</li>";
  msg1 = msg1 + "<li>Orientation: " + msgOrientation + "</li>";
  msg1 = msg1 + "<li>Quaternion: " + msgQuaternion + "</li>";
  msg1 = msg1 + "<li>StepCounter: " + msgStepCounter + "</li>";
  msg1 = msg1 + "<li>Euler: " + msgEuler + "</li>";
  msg1 = msg1 + "<li>Heading: " + msgHeading + "</li>";
  msg1 = msg1 + "<li>Gravity: " + msgGravity + "</li>";
  msg1 = msg1 + "</ul>";
  text1 = menuGenerator(req, res);
  msg1 = msg1 + text1;
  msg1 = msg1 + '</body></html>';
  return msg1;
}

//it generates the menu
function menuGenerator(req, res){
  msg2="";
  msg2 = msg2 + 'Status:' + res + '</br>';
  msg2 = msg2 + '<a href="/hs100onoff">1. Turn HS100 on/off</a></br>';
  msg2 = msg2 + '<a href="/hs100onoff">2. Turn Nettio on/off</a></br>';
  msg2 = msg2 + '<a href="/toggleledcolor">3. Toggle LED color</a></br>';
  //msg2 = msg2 + '<a href="/motionsensor">4. Toggle motion sensor</a></br>';
  msg2 = msg2 + '<a href="/">4. Refresh the page</a></br>';
  return msg2;
}

//Turning the HS100 on and off!
function hs100OnOff(){
  //const { Client } = require('tplink-smarthome-api');
  //const client = new Client();

client.getDevice({ host: '192.168.1.201' }).then((device) => {
  console.log('Found device:', device.deviceType, device.alias);

  if (device.deviceType === 'plug') {
    console.log('Turning plug on, then off', device.alias);
    device.setPowerState(true);
    device.setPowerState(false);
  }
});
  console.log("turning the HS100 on and off!");
}


//when the button of the thingy is pressed.
function onButtonChange(state) {
  console.log('Button: ' + state);

  if (state == 'Pressed')
  {
      hs100OnOff(); //it makes the HS100 to go on and off, through the module that is installed here. check the code here.
      boopTheIFTTT('onoff'); //it makes the Nettio plug 1 to go on and off
      //OR the HS100 through a proxy server. depends on what URL I give on the IFTTT maker.
      toggleLedColor();

      //activation or deactivation of the motion sensor
      if (enabled) {
        enabled = false;
        this.tap_disable(function(error) {
            console.log('Tap sensor stopped! ' + ((error) ? error : ''));
        });
        this.orientation_disable(function(error) {
            console.log('Orientation sensor stopped! ' + ((error) ? error : ''));
        });
        this.quaternion_disable(function(error) {
            console.log('Quaternion sensor stopped! ' + ((error) ? error : ''));
        });
        this.stepCounter_disable(function(error) {
            console.log('Step Counter sensor stopped! ' + ((error) ? error : ''));
        });
        this.raw_disable(function(error) {
            console.log('Raw sensor stopped! ' + ((error) ? error : ''));
        });
        this.euler_disable(function(error) {
            console.log('Euler sensor stopped! ' + ((error) ? error : ''));
        });
        this.rotation_disable(function(error) {
            console.log('Rotation sensor stopped! ' + ((error) ? error : ''));
        });
        this.heading_disable(function(error) {
            console.log('Heading sensor stopped! ' + ((error) ? error : ''));
        });
        this.gravity_disable(function(error) {
            console.log('Gravity sensor stopped! ' + ((error) ? error : ''));
        });
    }
    else {
        enabled = true;
        this.tap_enable(function(error) {
            console.log('Tap sensor started! ' + ((error) ? error : ''));
        });
        this.orientation_enable(function(error) {
            console.log('Orientation sensor started! ' + ((error) ? error : ''));
        });
        this.quaternion_enable(function(error) {
            console.log('Quaternion sensor started! ' + ((error) ? error : ''));
        });
        this.stepCounter_enable(function(error) {
            console.log('Step Counter sensor started! ' + ((error) ? error : ''));
        });
        this.raw_enable(function(error) {
            console.log('Raw sensor started! ' + ((error) ? error : ''));
        });
        this.euler_enable(function(error) {
            console.log('Euler sensor started! ' + ((error) ? error : ''));
        });
        this.rotation_enable(function(error) {
            console.log('Rotation sensor started! ' + ((error) ? error : ''));
        });
        this.heading_enable(function(error) {
            console.log('Heading sensor started! ' + ((error) ? error : ''));
        });
        this.gravity_enable(function(error) {
            console.log('Gravity sensor started! ' + ((error) ? error : ''));
        });
    }
  }
}

function toggleLedColor(){
  led_color = (led_color + 1) % 8;
        if (led_color == 0)
        {
            led_color = 1;
        }

        var led = {
          r : led_color * 5,
          g : 10,
          b : 10,
          intensity : 20,
          delay : 1000
      };

}

function activateMotion(){
    if (enabled) {
      enabled = false;
      tap_disable(function(error) {
          console.log('Tap sensor stopped! ' + ((error) ? error : ''));
      });
      orientation_disable(function(error) {
          console.log('Orientation sensor stopped! ' + ((error) ? error : ''));
      });
      quaternion_disable(function(error) {
          console.log('Quaternion sensor stopped! ' + ((error) ? error : ''));
      });
      stepCounter_disable(function(error) {
          console.log('Step Counter sensor stopped! ' + ((error) ? error : ''));
      });
      raw_disable(function(error) {
          console.log('Raw sensor stopped! ' + ((error) ? error : ''));
      });
      euler_disable(function(error) {
          console.log('Euler sensor stopped! ' + ((error) ? error : ''));
      });
      rotation_disable(function(error) {
          console.log('Rotation sensor stopped! ' + ((error) ? error : ''));
      });
      heading_disable(function(error) {
          console.log('Heading sensor stopped! ' + ((error) ? error : ''));
      });
      gravity_disable(function(error) {
          console.log('Gravity sensor stopped! ' + ((error) ? error : ''));
      });
  }
  else {
      enabled = true;
      tap_enable(function(error) {
          console.log('Tap sensor started! ' + ((error) ? error : ''));
      });
      orientation_enable(function(error) {
          console.log('Orientation sensor started! ' + ((error) ? error : ''));
      });
      quaternion_enable(function(error) {
          console.log('Quaternion sensor started! ' + ((error) ? error : ''));
      });
      stepCounter_enable(function(error) {
          console.log('Step Counter sensor started! ' + ((error) ? error : ''));
      });
      raw_enable(function(error) {
          console.log('Raw sensor started! ' + ((error) ? error : ''));
      });
      euler_enable(function(error) {
          console.log('Euler sensor started! ' + ((error) ? error : ''));
      });
      rotation_enable(function(error) {
          console.log('Rotation sensor started! ' + ((error) ? error : ''));
      });
      heading_enable(function(error) {
          console.log('Heading sensor started! ' + ((error) ? error : ''));
      });
      gravity_enable(function(error) {
          console.log('Gravity sensor started! ' + ((error) ? error : ''));
      });
  }
  }

function activateMotion2(){
  if (enabled) {
    enabled = false;
}
else {
    enabled = true;
}
}

//When we receive sensor data about gas from thingy52
function onGasSensorData(gas) {
  console.log('Gas sensor: eCO2 ' + gas.eco2 + ' - TVOC ' + gas.tvoc )
  if(gas != null){
    sdata.eco2 = gas.eco2;
    sdata.tvoc = gas.tvoc;
  }
  displayGas(gas.eco2, gas.tvoc);
}

function displayGas(eco2, tvoc){
  displayGasMsg = "Eco2:" + eco2 + " tvoc:" + tvoc;
  console.log("Eco2:" + eco2 + " tvoc:" + tvoc)
}

//discovers the thingy
function onDiscover(thingy) {
  console.log('Discovered: ' + thingy);

  thingy.on('disconnect', function() {
    console.log('Disconnected!');
  });

  thingy.connectAndSetUp(function(error) {
    console.log('Connected! ' + error);
    thingy.on('buttonNotif', onButtonChange);
    thingy.button_enable(function(error) {
      console.log('Button enabled! ' + error);
    });
    thingy.on('gasNotif', onGasSensorData);
    thingy.on('tapNotif', onTapData);
    thingy.on('orientationNotif', onOrientationData);
    thingy.on('quaternionNotif', onQuaternionData);
    thingy.on('stepCounterNotif', onStepCounterData);
    thingy.on('rawNotif', onRawData);
    thingy.on('eulerNotif', onEulerData);
    thingy.on('rotationNotif', onRotationData);
    thingy.on('headingNotif', onHeadingData);
    thingy.on('gravityNotif', onGravityData);
    thingy.on('buttonNotif', onButtonChange);

    thingy.motion_processing_freq_set(5, function(error) {
        if (error) {
            console.log('Motion freq set configure failed! ' + error);
        }
    });    

    enabled = true;
    thingy.orientation_enable(function(error) {
        console.log('Orientation sensor started! ' + ((error) ? error : ''));
    });
    thingy.rotation_enable(function(error) {
        console.log('Rotation sensor started! ' + ((error) ? error : ''));
    });
    connectAndEnableGas(thingy);
  });
}


function connectAndEnableGas(thingy) {
  thingy.connectAndSetUp(function(error) {
      console.log('Connected! ' + ((error) ? error : ''));
      thingy.gas_mode_set(3, function(error) {
          console.log('Gas sensor configured! ' + ((error) ? error : ''));
      });
      thingy.gas_enable(function(error) {
          console.log('Gas sensor started! ' + ((error) ? error : ''));
      });
  });
}

//task 2 code
//this is used by the boopTheIFTTT method that boops the IFTTT link.
function makeRequest (params, cb){
  request(params, function (error, response, body) {
    if (response) {
        if (response.statusCode == 200) {
          return cb('An amazing boop');
        }
        return cb(JSON.parse(body)['errors']);
    }
    else {
        return cb('Failed');
    }
  });
}

//it makes a GET request, (a boop), to the given url
function boopTheIFTTT(maker_evt)
{
    var requestParams = {
      url: util.format(BASE_URL, maker_evt, maker_key),
      method: 'GET'
    };

    makeRequest(requestParams, function (err) {
        console.log('booping the ifttt: ' + err)
    });
}

console.log('IFTTT Thingy gas sensor!');

process.argv.forEach(function(val, index, array){
    if (val == '-a') {
        if (process.argv[index + 1]) {
            thingy_id = process.argv[index + 1];
        }
    }
    else if (val == '-e') {
        if (process.argv[index + 1]) {
            maker_evt = process.argv[index + 1];
        }
    }
    else if (val == '-k') {
        if (process.argv[index + 1]) {
            maker_key = process.argv[index + 1];
        }
    }
});

//Motion sensor code
console.log('Reading Thingy Motion sensors!');

var Direction = Object.freeze([
    'UNDEFINED',
    'TAP_X_UP', 'TAP_X_DOWN',
    'TAP_Y_UP', 'TAP_Y_DOWN',
    'TAP_Z_UP', 'TAP_Z_DOWN'
]);

var Orientation = Object.freeze([
    'Portrait', 'Landscape', 'Reverse portrait', 'Reverse landscape'
]);

function onTapData(tap) {
    console.log('Tap data: Dir: %s (%d), Count: %d', 
                        Direction[tap.direction], tap.direction, tap.count);

    if(Direction != null){
        sdata.Direction = Direction;
    }
    if(tap.direction != null){
        sdata.tapdirection = tap.direction;
    }
    if(tap.count != null){
        sdata.tapcount = tap.count;
    }

    msgTap = "Dir:" + Direction[tap.direction] + " (" + tap.direction + "), Count:" + tap.count;
}

function onOrientationData(orientation) {
    console.log('Orientation data: %s (%d)', Orientation[orientation], orientation);
    if(Orientation != null){
        sdata.Orientation = Orientation;
    }
    if(orientation != null){
        sdata.Orientation = orientation;
    }
    msgOrientation = Orientation[orientation] + " (" + orientation + ")";
}

function onQuaternionData(quaternion) {
    console.log('Quaternion data: w: %d, x: %d, y: %d, z: %d', 
        quaternion.w, quaternion.x, quaternion.y, quaternion.z);
    
    if(quaternion != null){
        sdata.quaternionw = quaternion.w;
        sdata.quaternionx = quaternion.x;
        sdata.quaterniony = quaternion.y;
        sdata.quaternionz = quaternion.z;
    }
    msgQuaternion = "x:" + quaternion.x + ", y:" + quaternion.y + ", z:" + quaternion.z;;
}

function onStepCounterData(stepCounter) {
    console.log('Step Counter data: Steps: %d, Time[ms]: %d', 
        stepCounter.steps, stepCounter.time);
        if(stepCounter != null){
            sdata.stepCounter.steps = stepCounter.steps;
            sdata.stepCounter.time = stepCounter.time;
        }

    msgStepCounter = "Steps:" + stepCounter.steps + ", Time:" +  stepCounter.time;
}

function onRawData(raw_data) {
    console.log('Raw data: Accelerometer: x %d, y %d, z %d', 
        raw_data.accelerometer.x, raw_data.accelerometer.y, raw_data.accelerometer.z);
    console.log('Raw data: Gyroscope: x %d, y %d, z %d', 
        raw_data.gyroscope.x, raw_data.gyroscope.y, raw_data.gyroscope.z);
    console.log('Raw data: Compass: x %d, y %d, z %d', 
        raw_data.compass.x, raw_data.compass.y, raw_data.compass.z);
}

function onEulerData(euler) {
    console.log('Euler angles: roll %d, pitch %d, yaw %d', 
        euler.roll, euler.pitch, euler.yaw);

        if(euler != null){
            sdata.eulerroll = euler.roll;
            sdata.eulerpitch = euler.pitch;
            sdata.euleryaw = euler.yaw;
        }
    msgEuler = "The angles are roll " + euler.roll +", pitch " + euler.pitch + ", and yaw " + euler.yaw;
}

function onRotationData(rotation) {
    console.log('Rotation: matrix:');
    console.table(rotation);
}

function onHeadingData(heading) {
    console.log('Heading: %d', heading);
    msgHeading = heading;
    if(heading != null){
        sdata.heading = heading;
    }
}

function onGravityData(gravity) {
    console.log('Gravity: x: %d, y %d, z %d', gravity.x, gravity.y, gravity.z);
    msgGravity = "x:" + gravity.x + ", y:" + gravity.y + ", z:" + gravity.z;
    
    if(gravity != null){
        sdata.gravityx = gravity.x;
        sdata.gravityy = gravity.y;
        sdata.gravityz = gravity.z;
    }
}

Thingy.discover(onDiscover);