require("dotenv").config();
const request = require("supertest");
const app = require("../app");

let token;

describe("Sweets API", () => {
  beforeAll(async () => {
    await request(app).post("/api/auth/register").send({
      email: "sweetuser@example.com",
      password: "123456",
    });

    const loginRes = await request(app).post("/api/auth/login").send({
      email: "sweetuser@example.com",
      password: "123456",
    });

    token = loginRes.body.token;
  });

  it("should not allow access without token", async () => {
    const res = await request(app).get("/api/sweets");
    expect(res.statusCode).toBe(401);
  });

  it("should allow access with valid token", async () => {
    const res = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

  });

  it("should allow authenticated user to add a sweet", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Gulab Jamun",
        category: "Dessert",
        price: 20,
        quantity: 50,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.name).toBe("Gulab Jamun");
  });
});
