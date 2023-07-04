const influx = require('influx')

const client = new influx.InfluxDB({
    database: process.env.INFLUX_DATABASE,
    host: process.env.INFLUXDB_HOST,
    username: process.env.INFLUXDB_USERNAME,
    password: process.env.INFLUXDB_PASS,
    port: 8086
})

const getClient = () => {
    console.log("Want me again")
    return client;
}

module.exports.getClient = getClient;