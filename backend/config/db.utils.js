const influx = require('influx')
const config = require('./env.config');

const client = new influx.InfluxDB({
    database: config.influxdb.INFLUX_DATABASE,
    host: config.influxdb.INFLUXDB_HOST,
    username: config.influxdb.INFLUXDB_USERNAME,
    password: config.influxdb.INFLUXDB_PASS,
    port: 8086
})

const getClient = () => {
    return client;
}

module.exports.getClient = getClient;