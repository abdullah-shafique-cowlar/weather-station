const influx = require('influx')
const env = process.env.NODE_ENV || 'development';
const config = require('../config/sensor.config.json')[env];

const client = new influx.InfluxDB({
    database: config.INFLUX_DATABASE,
    host: config.INFLUXDB_HOST,
    username: config.INFLUXDB_USERNAME,
    password: config.INFLUXDB_PASS,
    port: 8086
})

const getClient = () => {
    return client;
}

module.exports.getClient = getClient;