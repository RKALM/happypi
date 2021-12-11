//const { Client } = require('..'); // or require('tplink-smarthome-api')
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
