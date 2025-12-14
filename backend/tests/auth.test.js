require("dotenv").config();
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");

describe("Auth API", () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        email: "testuser_unique@example.com",
        password: "123456",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
  });

  it("should login an existing user", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        email: "loginuser_unique@example.com",
        password: "123456",
      });

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "loginuser_unique@example.com",
        password: "123456",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
