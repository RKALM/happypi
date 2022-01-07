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
//HS100
const { Client } = require('tplink-smarthome-api');
const client = new Client();

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

//Turning the Nettio on and off!
app.get('/nettioonoff', (req, res) => {
  //hs100OnOff();
  //res.send('Hello HS100!')
  boopTheIFTTT('onoff'); //it makes the Nettio plug 1 to go on and off
  let msg = pageGenerator("index", req, res); //generates a page dynamically.
  res.write(msg);
})

//Changing the color of the LED
app.get('/toggleledcolor', (req, res) => {
  toggleLedColor();
  let msg = pageGenerator("index", req, res); //generates a page dynamically.
  res.write(msg);
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
  msg1 = msg1 + "<p>Gas: " + displayGasMsg + "</p>";
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
  msg2 = msg2 + '<a href="/hs100onoff">1. Turn Nettio on/off</a></br>';
  msg2 = msg2 + '<a href="/toggleledcolor">2. Toggle LED color</a></br>';
  msg2 = msg2 + '<a href="/">3. Refresh the page</a></br>';
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

//When we receive sensor data about gas from thingy52
function onGasSensorData(gas) {
  console.log('Gas sensor: eCO2 ' + gas.eco2 + ' - TVOC ' + gas.tvoc )
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

Thingy.discover(onDiscover);