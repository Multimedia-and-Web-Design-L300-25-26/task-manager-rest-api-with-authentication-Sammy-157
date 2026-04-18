import request from "supertest";
import app from "../src/app.js";
import mongoose from "mongoose";
import User from "../src/models/User.js";

describe("Auth Routes", () => {

  let token;

  // Clear users before each test
  beforeEach(async () => {
    await User.deleteMany({});
  });

  // Close DB connection after all tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should register a user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: `test${Date.now()}@example.com`, // unique email
        password: "123456"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.email).toMatch(/test\d+@example\.com/);
  });

  it("should login user and return token", async () => {
    // First, create a user to login
    const email = `login${Date.now()}@example.com`;
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Login User",
        email,
        password: "123456"
      });

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email,
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();

    token = res.body.token;
  });

});