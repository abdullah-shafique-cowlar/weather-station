const request = require("supertest");
const app = require("../app"); // Assuming your Express app is defined in app.js
const Models = require("../models");
const { User } = Models;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { sequelize } = require('../models/index');
dotenv.config();

const { register } = require("../controllers/v1/user.controller");

beforeAll(async () => {
  await sequelize.authenticate();
  await sequelize.sync({ force: true }); // Sync the models with the test database
});

afterAll(async () => {
  await sequelize.drop(); // Drop the tables after all tests are finished
  await sequelize.close(); // Close the database connection
});

describe("POST /api/v1/register", () => {
  let server;
  beforeEach(() => {
    server = app.listen();
  });
  afterEach(async () => {
    await server.close();
  });

  it("should create a new user", async () => {
    // Mock the request body
    const reqBody = {
      user_name: "testuser",
      email: "test@example.com",
      password: "password",
    };

    // Mock the User.create() method
    const createUserMock = jest
      .spyOn(User, "create")
      .mockResolvedValueOnce(reqBody);

    // Send a POST request to the /api/register endpoint
    const response = await request(server).post("/api/v1/register").send(reqBody);

    // Assertion
    expect(createUserMock).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(reqBody);
  });

  it("should return an error if user or email already exists", async () => {
    // Mock the request body
    const reqBody = {
      user_name: "existinguser",
      email: "existing@example.com",
      password: "password",
    };

    // Mock the User.findOne() method to return an existing user
    jest.spyOn(User, "findOne").mockResolvedValueOnce({});

    // Send a POST request to the /api/register endpoint
    const response = await request(server).post("/api/v1/register").send(reqBody);

    // Assertion
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "User or email already exists" });
  });
});
