var express = require("express");
var logger = require("morgan");
require("dotenv").config();
const helmet = require("helmet");
const cors = require("cors");
const influx_client = require("./config/db.utils").getClient();
const client = require('./config/mqtt.utils')
client.connect();
mqttClient = client.getClient()

// importing the router
var apiRouterV1 = require("./routes/v1/api");
const mqttUtils = require("./config/mqtt.utils");

var app = express();

const corsOptions = {
  //multiple origins
  origin: "http://localhost:5173",
  methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "DELETE", "PATCH"],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb" }));
app.use(helmet()); // Helmet helps you secure your Express apps by setting various HTTP headers.
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// on receive message event, log the message to the console
mqttClient.on("message", async (topic, message, packet) => {
  //   console.log(packet, packet.payload.toString());
  if (packet.retain === true) {
    // console.debug("Received retained message. Skipping write to the database.");
    return;
  }
  if (topic === topicName) {
    const payload = JSON.parse(message);
    const temperature = payload.temperature;
    const humidity = payload.humidity;
    console.debug("Temperature:", temperature);
    console.debug("Humidity:", humidity);

    // write to influx db on weather_data measurement
    try {
      const dataPoint = {
        measurement: "weather_data",
        tags: { host: "localhost" },
        fields: { temperature: temperature, humidity: humidity },
      };

      await influx_client.writePoints([dataPoint]);
        console.log("[+] Point Written: ", dataPoint);
    } catch (error) {
        console.log("[-] Error: ", error);
    }
  }
});

//calling the routers
app.use("/api/v1", apiRouterV1);

app.all("*", (req, res, next) => {
  res.status(404).json({ Error: `Cant Find ${req.originalUrl}` }); // 404 Not Found
});

module.exports = app;
