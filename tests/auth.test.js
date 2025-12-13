require("dotenv").config();
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");

describe("Auth API - Register", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        email: "testuser@example.com",
        password: "123456",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
  });
});
