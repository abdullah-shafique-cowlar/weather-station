const request = require("supertest");
const app = require("../app"); // Assuming your Express app is defined in app.js
const Models = require("../models");
const { User } = Models;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { sequelize } = require("../models/index");
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
    const response = await request(server)
      .post("/api/v1/register")
      .send(reqBody);

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
    const response = await request(server)
      .post("/api/v1/register")
      .send(reqBody);

    // Assertion
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "User or email already exists" });
  });
});

describe('Login', () => {

  let server;
  beforeEach(() => {
    server = app.listen();
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
    const response = await request(server)
      .post("/api/v1/register")
      .send(reqBody);

    // Assertion
    expect(createUserMock).toHaveBeenCalledTimes(2);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(reqBody);
  });

  it('should return a token when valid credentials are provided', async () => {
    // Mock the User.findOne() method to return a user with valid credentials
    jest.spyOn(User, 'findOne').mockResolvedValueOnce({
      password: bcrypt.hashSync('password', 10),
    });
  
    const response = await request(app)
      .post('/api/v1/login')
      .send({ email: 'test@example.com', password: 'password' })
      .expect(200);
  
    expect(response.body).toHaveProperty('token');
    expect(typeof response.body.token).toBe('string');
  });

  it('should return an error when invalid credentials are provided', async () => {
    const response = await request(app)
      .post('/api/v1/login')
      .send({ email: 'invalid@example.com', password: 'invalidpassword' })
      .expect(404);

    expect(response.body).toHaveProperty('error', 'User does not exist');
  });

  it('should return an error when the user does not exist', async () => {
    const response = await request(app)
      .post('/api/v1/login')
      .send({ email: 'nonexistent@example.com', password: 'password123' })
      .expect(404);

    expect(response.body).toHaveProperty('error', 'User does not exist');
  });
});

describe('Profile', () => {
  let server;
  let token;

  beforeAll(async () => {
    // Create a new user and obtain the token for authentication
    const user = {
      user_name: 'testuser',
      email: 'test@example.com',
      password: bcrypt.hashSync('password', 10),
    };

    await User.create(user);

    const response = await request(app)
      .post('/api/v1/login')
      .send({ email: 'test@example.com', password: 'password' })
      .expect(200);

    token = response.body.token;
  });

  beforeEach(() => {
    server = app.listen();
  });

  afterEach(() => {
    server.close();
  });

  it('should return the profile of the authenticated user', async () => {
    const response = await request(server)
      .get('/api/v1/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toHaveProperty('user_name', 'testuser');
    expect(response.body).toHaveProperty('email', 'test@example.com');
    expect(response.body).not.toHaveProperty('password');
  });

  it('should return an error if the user is not authenticated', async () => {
    const response = await request(server)
      .get('/api/v1/me')
      .expect(401);

    expect(response.body).toEqual({ msg: 'Couldnt Authenticate' });
  });
});
