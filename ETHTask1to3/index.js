const express = require('express')
var Thingy = require('./index2');
var request = require('request');
var util = require('util');
const app = express()
const port = 3000
var maker_key = 'j2eqWrlFER7ngphU4IUTDmYD7QNigvN_mqXCg36Kd0L';
var BASE_URL = 'https://maker.ifttt.com/trigger/%s/with/key/%s';

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
  text1 = menuGenerator(req, res);
  msg1 = msg1 + text1;
  msg1 = msg1 + '</body></html>';
  return msg1;
}

//it generates the menu
function menuGenerator(req, res){
  msg2="";
  msg2 = msg2 + 'Status:' + res + '</br>';
  msg2 = msg2 + '<a href="/hs100onoff">1. Turn smart plug on/off</a></br>';
  return msg2;
}

//Turning the HS100 on and off!
function hs100OnOff(){
  const { Client } = require('tplink-smarthome-api');
  const client = new Client();

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
  }
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

Thingy.discover(onDiscover);