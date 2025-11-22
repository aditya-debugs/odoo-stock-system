import request from "supertest";
import app from "../app.js";
import sequelize from "../config/db.js";
import User from "../models/User.js";

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Auth Endpoints", () => {
  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "Test123!",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("token");
      expect(res.body.data.user).toHaveProperty("email", "test@example.com");
    });

    it("should not register user with existing email", async () => {
      await User.create({
        name: "Existing User",
        email: "existing@example.com",
        password: "Test123!",
      });

      const res = await request(app).post("/api/auth/register").send({
        name: "Another User",
        email: "existing@example.com",
        password: "Test123!",
      });

      expect(res.statusCode).toBe(400);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await User.create({
        name: "Login User",
        email: "login@example.com",
        password: "Test123!",
      });
    });

    it("should login with valid credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "login@example.com",
        password: "Test123!",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("token");
    });

    it("should not login with invalid password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "login@example.com",
        password: "WrongPassword",
      });

      expect(res.statusCode).toBe(401);
    });
  });
});
