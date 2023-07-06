require("dotenv").config();

const config = {
    development: {
        port: process.env.PORT || 3000, // env variable
        secret: process.env.SECRET || "secret",
        influxdb: {
            measurement: "weather_data"
        }
    },
    test: {
        port: process.env.PORT || 3000,
        secret: process.env.SECRET || "secret",
        influxdb: {
            measurement: "test_measurement"
        }
    },
    production: {
        port: process.env.PORT || 3000,
        secret: process.env.SECRET || "secret"
    }
}

module.exports = config[process.env.NODE_ENV || 'development'];