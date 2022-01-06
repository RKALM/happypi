const express = require('express')
const app = express()
const port = 3000
//HS100
const { Client } = require('tplink-smarthome-api');

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/onoff', (req, res) => {
  const client = new Client();

client.getDevice({ host: '192.168.1.201' }).then((device) => {
  console.log('Found device:', device.deviceType, device.alias);

  if (device.deviceType === 'plug') {
    console.log('Turning plug on, then off', device.alias);
    device.setPowerState(true);
    device.setPowerState(false);
  }
});
  res.send('Hello On or Off!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})