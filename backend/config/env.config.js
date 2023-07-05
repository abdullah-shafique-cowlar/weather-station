require("dotenv").config();

const config = {
    development: {
        port: 3000,
        secret: "secret",
        influxdb: {
            measurement: "weather_data"
        }
    },
    test: {
        port: 3000,
        secret: "secret",
        influxdb: {
            measurement: "test_measurement"
        }
    },
    production: {
        port: 3000,
        secret: "gahgj65677ghd678dgs7d8tsgd7809965g"
    }
}

module.exports = config[process.env.NODE_ENV || 'development'];