import request from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "../app.js";
import User from "../models/User.js";
// CHANGE HERE: Add 'jest' to the import list
import { describe, it, expect, beforeAll, afterAll, jest } from "@jest/globals";

dotenv.config();

// Now this will work
jest.setTimeout(30000);

describe("Auth Endpoints", () => {
  // ... (Rest of the file remains exactly the same)

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user and return 201 status", async () => {
      const newUser = {
        username: "candyman",
        email: "willy@wonka.com",
        password: "securepassword123",
      };

      const res = await request(app).post("/api/auth/register").send(newUser);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty(
        "message",
        "User registered successfully"
      );
      expect(res.body).toHaveProperty("token");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login an existing user and return a token", async () => {
      const userCredentials = {
        username: "loginuser",
        email: "login@test.com",
        password: "password123",
      };

      await request(app).post("/api/auth/register").send(userCredentials);

      const res = await request(app).post("/api/auth/login").send({
        email: userCredentials.email,
        password: userCredentials.password,
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("token");
      expect(res.body).toHaveProperty("email", userCredentials.email);
    });

    it("should return 401 for invalid password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "login@test.com",
        password: "WRONGpassword",
      });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty("message", "Invalid email or password");
    });
  });
});
