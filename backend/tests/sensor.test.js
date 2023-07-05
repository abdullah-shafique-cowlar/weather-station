const request = require("supertest");
const app = require("../app"); // Assuming your Express app is defined in app.js
const influx_client = require("../config/db.utils").getClient();
const sensorController = require("../controllers/v1/sensor.controller");

jest.mock("../config/db.utils", () => ({
  getClient: jest.fn().mockReturnValue({
    query: jest.fn(),
    writePoints: jest.fn(),
  }),
}));

describe("Sensor Controller", () => {
  beforeAll(() => {
    const dataPoints = [
      {
        measurement: "test_measurement",
        tags: { host: "localhost" },
        fields: { temperature: 25, humidity: 50 },
        timestamp: "2023-01-01T00:00:00Z",
      },
      {
        measurement: "test_measurement",
        tags: { host: "localhost" },
        fields: { temperature: 30, humidity: 40 },
        timestamp: "2023-01-02T00:00:00Z",
      },
      {
        measurement: "test_measurement",
        tags: { host: "localhost" },
        fields: { temperature: 35, humidity: 45 },
        timestamp: "2023-01-03T00:00:00Z",
      },
      {
        measurement: "test_measurement",
        tags: { host: "localhost" },
        fields: { temperature: 40, humidity: 50 },
        timestamp: "2023-01-04T00:00:00Z",
      },
    ];

    influx_client.writePoints.mockResolvedValue();
    influx_client.query.mockResolvedValue([{ data: "mockedData" }]);

    return influx_client.writePoints(dataPoints);
  });

  afterAll(() => {
    influx_client.query.mockResolvedValue([{ data: "mockedData" }]);

    return influx_client.query(`DELETE FROM test_measurement`);
  });

  describe("getAllData", () => {
    it("should get all data points", async () => {
      // Mock the request and response objects
      const req = { params: {} };
      const res = { send: jest.fn() };

      // Call the getAllData function
      await sensorController.getAllData(req, res);

      // Check the response
      expect(res.send).toHaveBeenCalledWith([{ data: "mockedData" }]);
    });
  });

  describe("duration_data", () => {
    it("should get data points within time frame", async () => {
      influx_client.query.mockResolvedValueOnce([{ data: "mockedData" }]);

      const req = {
        body: {
          startTime: "2023-01-02T00:00:00Z",
          endTime: "2023-01-03T00:00:00Z",
        },
      };
      const res = { send: jest.fn() };

        const response = await request(app).get("/api/v1/duration_data").send(req);
    //   const response = await sensorController.durationData(req, res);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ data: "mockedData" }]);

      expect(influx_client.query).toHaveBeenCalledWith(
        `select * from test_measurement where time>='${req.body.startTime}' AND time<='${req.body.endTime}'`
      );
    });
  });
});
