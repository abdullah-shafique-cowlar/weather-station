const mqtt = require('mqtt');
const topicName = 'Weather_Data';

let client;
// mqtt://test.mosquitto.org/
function connect() {
  client = mqtt.connect('mqtt://broker.hivemq.com');

  client.on('connect', () => {
    client.subscribe(topicName, { qos: 2 }, (err, granted) => {
      if (err) {
        console.error(err);
      }
    });
  });
}

function disconnect() {
  if (client) {
    client.end();
  }
}

module.exports = {
  connect,
  disconnect,
  getClient: () => client,
  topicName
};
