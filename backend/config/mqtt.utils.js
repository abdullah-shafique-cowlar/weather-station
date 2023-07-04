const mqtt = require('mqtt');
const topicName = 'Weather_Data';

let client;

function connect() {
  client = mqtt.connect('mqtt://broker.hivemq.com');

  client.on('connect', () => {
    client.subscribe(topicName, { qos: 2 }, (err, granted) => {
      if (err) {
        console.error(err);
      }
    });
  });

  client.on('message', async (topic, message, packet) => {
    // Message handling logic
    // ...
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
};
