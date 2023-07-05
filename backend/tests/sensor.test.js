const request = require("supertest");
const app = require("../app"); // Assuming your Express app is defined in app.js
const influx_client = require("../config/db.utils").getClient();
const sensorController = require("../controllers/v1/sensor.controller");
const _ = require("lodash");
let dataPoints = [];
let dates = [];

describe("Sensor Controller", () => {
  beforeAll(async () => {
    dates = [
      new Date(_.random(1688541144000, 1688713944000)),
      new Date(_.random(1689837144000, 1690269144000)),
      new Date(_.random(1690355544000, 1690614744000)),
      new Date(_.random(1690960344000, 1692515544000)),
    ];

    dataPoints = [
      {
        measurement: "test_measurement",
        tags: { host: "localhost" },
        fields: { temperature: 25, humidity: 50 },
        timestamp: dates[0],
      },
      {
        measurement: "test_measurement",
        tags: { host: "localhost" },
        fields: { temperature: 20, humidity: 22.2 },
        timestamp: dates[1],
      },
      {
        measurement: "test_measurement",
        tags: { host: "localhost" },
        fields: { temperature: 19.8, humidity: 37.5 },
        timestamp: dates[2],
      },
      {
        measurement: "test_measurement",
        tags: { host: "localhost" },
        fields: { temperature: 22, humidity: 22 },
        timestamp: dates[3],
      },
    ];

    try {
      await influx_client.writePoints(dataPoints);
      console.log("[+] Point Written: ", dataPoints);
    } catch (error) {
      console.log("[-] Error: ", error);
    }
  });

  afterAll(() => {
    return influx_client.query(`DELETE FROM test_measurement`);
  });

  describe("Get All Data", () => {
    it("should get all data points", async () => {
      // Mock the request and response objects
      const req = { params: {} };
      const res = { send: jest.fn() };

      // Call the getAllData function
      const response = await request(app)
        .get("/api/v1/alldata")
        .send(req)
        .expect(200);

      console.log(response.body);

      // expect(response.body).toHaveLength(4)
      expect(response.body).toEqual(
        expect.arrayContaining(
          dataPoints.map(({ tags, fields, timestamp }) => ({
            host: tags.host,
            humidity: fields.humidity,
            temperature: fields.temperature,
            time: timestamp.toISOString(),
          }))
        )
      );
    });
  });

  describe("Get Duration data", () => {
    it("should get data points within time frame", async () => {
      const req = {
        body: {
          startTime: dates[1],
          endTime: dates[3],
        },
      };

      const response = await request(app)
        .post("/api/v1/duration_data")
        .send(req.body)
        .expect(200);

      expect(response.body).toHaveLength(3)
    }, 10000);
  });
});
