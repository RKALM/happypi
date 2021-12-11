const express = require('express')
var Thingy = require('./index2');
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

//Turning the HS100 on and off!
app.get('/hs100onoff', (req, res) => {
  hs100OnOff();
  res.send('Hello HS100!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

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
      hs100OnOff();
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

Thingy.discover(onDiscover);