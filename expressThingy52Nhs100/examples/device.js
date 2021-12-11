//const { Client } = require('..'); // or require('tplink-smarthome-api')
const { Client } = require('tplink-smarthome-api')


const client = new Client();

client.getDevice({ host: '192.168.1.201' }).then((device) => {
  device.getSysInfo().then(console.log);
});
