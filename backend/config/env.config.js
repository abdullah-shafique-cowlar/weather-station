require("dotenv").config();

const config = {
    development: {
        port: process.env.PORT || 3000, // env variable
        secret: process.env.SECRET || "secret",
        influxdb: {
            INFLUXDB_USERNAME: process.env.INFLUXDB_USERNAME || "root",
            INFLUXDB_PASS: process.env.INFLUXDB_PASS || "root",
            INFLUXDB_HOST: process.env.INFLUXDB_HOST || "http://localhost",
            measurement: process.env.INFLUXDB_DATABASE_DEV || "weather_data",
            INFLUX_DATABASE: process.env.INFLUX_DATABASE_DEV || "weather_dev",
            TOPIC: process.env.TOPIC_DEV || "Weather_Data",
            INFLUX_PORT: process.env.INFLUXDB_PORT || 8086,
            INFLUX_ORG: process.env.INFLUX_ORG || "Cowlar",
            INFLUX_BUCKET: process.env.INFLUX_BUCKET || "weather_data",
            INFLUX_TOKEN: process.env.INFLUX_TOKEN,
            INFLUX_MEASUREMENT: process.env.INFLUX_MEASUREMENT || "weather_measurement"
        }
    },
    test: {
        port: process.env.PORT || 3000,
        secret: process.env.SECRET || "secret",
        influxdb: {
            INFLUXDB_USERNAME: process.env.INFLUXDB_USERNAME || "root",
            INFLUXDB_PASS: process.env.INFLUXDB_PASS || "root",
            INFLUXDB_HOST: process.env.INFLUXDB_HOST || "localhost",
            measurement: process.env.INFLUXDB_DATABASE_TEST || "test_measurement",
            INFLUX_DATABASE: process.env.INFLUX_DATABASE_TEST || "weather_test",
            TOPIC: process.env.TOPIC_TEST || "Weather_Data"
        }
    },
    production: {
        port: process.env.PORT || 3000,
        secret: process.env.SECRET || "secret",
        influxdb: {
            INFLUXDB_USERNAME: process.env.INFLUXDB_USERNAME || "root",
            INFLUXDB_PASS: process.env.INFLUXDB_PASS || "root",
            INFLUXDB_HOST: process.env.INFLUXDB_HOST || "localhost",
            measurement: process.env.INFLUXDB_DATABASE_PROD || "test_measurement",
            INFLUX_DATABASE: process.env.INFLUX_DATABASE_PROD || "weather_test",
            TOPIC: process.env.TOPIC_PROD || "Weather_Data"
        }
    }
}

module.exports = config[process.env.NODE_ENV || 'development'];