import request from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "../app.js";
import User from "../models/User.js";
import Sweet from "../models/Sweet.js";
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  jest,
} from "@jest/globals";

dotenv.config();

jest.setTimeout(30000);

describe("Sweets Endpoints", () => {
  let token;

  // 1. Connect to DB once before any tests run
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  // 2. Disconnect only after ALL tests in this file are done
  afterAll(async () => {
    await mongoose.connection.close();
  });

  // 3. Reset data before each test
  beforeEach(async () => {
    await Sweet.deleteMany({});
    await User.deleteMany({});

    // Create Admin User & Token
    const user = await User.create({
      username: "admin",
      email: "admin@sweetshop.com",
      password: "password123",
      role: "admin", // Ensure admin role for later tests
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "admin@sweetshop.com",
      password: "password123",
    });
    token = res.body.token;
  });

  // --- POST Tests ---
  describe("POST /api/sweets", () => {
    it("should fail (401) if no token is provided", async () => {
      const res = await request(app)
        .post("/api/sweets")
        .send({ name: "Chocolate Bar", price: 2.5 });

      expect(res.statusCode).toEqual(401);
    });

    it("should create a new sweet (201) with valid token", async () => {
      const newSweet = {
        name: "Gummy Bears",
        category: "Gummies",
        price: 1.99,
        quantity: 100,
      };

      const res = await request(app)
        .post("/api/sweets")
        .set("Authorization", `Bearer ${token}`)
        .send(newSweet);

      expect(res.statusCode).toEqual(201);
      expect(res.body.name).toEqual("Gummy Bears");
    });
  });

  // --- GET Tests ---
  describe("GET /api/sweets", () => {
    it("should return a list of all sweets", async () => {
      await Sweet.create([
        { name: "Choco Bar", category: "Chocolate", price: 2, quantity: 10 },
        { name: "Lollipop", category: "Hard Candy", price: 1, quantity: 20 },
      ]);

      const res = await request(app)
        .get("/api/sweets")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(2);
    });
  });

  describe("GET /api/sweets/search", () => {
    it("should filter sweets by name", async () => {
      await Sweet.create([
        { name: "Apple Pie", category: "Bakery", price: 5, quantity: 5 },
        { name: "Apple Tart", category: "Bakery", price: 4, quantity: 5 },
        { name: "Chocolate Cake", category: "Bakery", price: 10, quantity: 2 },
      ]);

      const res = await request(app)
        .get("/api/sweets/search?query=Apple")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(2);
      expect(res.body[0].name).toMatch(/Apple/);
    });
  });

  // --- UPDATE & DELETE Tests (Pre-adding these for the next step) ---
  describe("PUT /api/sweets/:id", () => {
    it("should update a sweet", async () => {
      const sweet = await Sweet.create({
        name: "Old Name",
        category: "Test",
        price: 1,
        quantity: 10,
      });

      const res = await request(app)
        .put(`/api/sweets/${sweet._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "New Name", price: 5 });

      expect(res.statusCode).toEqual(200);
      expect(res.body.name).toEqual("New Name");
      expect(res.body.price).toEqual(5);
    });
  });

  describe("DELETE /api/sweets/:id", () => {
    it("should prevent non-admins from deleting sweets", async () => {
      const sweet = await Sweet.create({
        name: "To Delete",
        category: "Test",
        price: 1,
        quantity: 10,
      });

      // Create a non-admin user
      const normie = await User.create({
        username: "normie",
        email: "normie@test.com",
        password: "123",
        role: "user",
      });
      const normieRes = await request(app)
        .post("/api/auth/login")
        .send({ email: "normie@test.com", password: "123" });
      const normieToken = normieRes.body.token;

      const res = await request(app)
        .delete(`/api/sweets/${sweet._id}`)
        .set("Authorization", `Bearer ${normieToken}`);

      expect(res.statusCode).toEqual(403);
    });

    it("should allow admin to delete sweet", async () => {
      const sweet = await Sweet.create({
        name: "To Delete",
        category: "Test",
        price: 1,
        quantity: 10,
      });

      const res = await request(app)
        .delete(`/api/sweets/${sweet._id}`)
        .set("Authorization", `Bearer ${token}`); // This token is admin

      expect(res.statusCode).toEqual(200);

      const check = await Sweet.findById(sweet._id);
      expect(check).toBeNull();
    });
  });
  // ... existing delete tests ...

  describe("Inventory Operations", () => {
    describe("POST /api/sweets/:id/purchase", () => {
      it("should purchase a sweet and decrease quantity", async () => {
        const sweet = await Sweet.create({
          name: "Candy Cane",
          category: "Xmas",
          price: 1,
          quantity: 5,
        });

        const res = await request(app)
          .post(`/api/sweets/${sweet._id}/purchase`)
          .set("Authorization", `Bearer ${token}`)
          .send({ quantity: 1 }); // Buying 1

        expect(res.statusCode).toEqual(200);
        expect(res.body.quantity).toEqual(4);
      });

      it("should fail if sweet is out of stock", async () => {
        const sweet = await Sweet.create({
          name: "Rare Candy",
          category: "Pokemon",
          price: 100,
          quantity: 0,
        });

        const res = await request(app)
          .post(`/api/sweets/${sweet._id}/purchase`)
          .set("Authorization", `Bearer ${token}`)
          .send({ quantity: 1 });

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toMatch(/out of stock/i);
      });
    });

    describe("POST /api/sweets/:id/restock", () => {
      it("should allow admin to restock sweets", async () => {
        const sweet = await Sweet.create({
          name: "Empty Bin",
          category: "Bulk",
          price: 1,
          quantity: 0,
        });

        const res = await request(app)
          .post(`/api/sweets/${sweet._id}/restock`)
          .set("Authorization", `Bearer ${token}`) // Admin token
          .send({ quantity: 50 });

        expect(res.statusCode).toEqual(200);
        expect(res.body.quantity).toEqual(50);
      });

      it("should prevent non-admin from restocking", async () => {
        const sweet = await Sweet.create({
          name: "Empty Bin",
          category: "Bulk",
          price: 1,
          quantity: 0,
        });

        // Create normal user
        const normie = await User.create({
          username: "normie2",
          email: "normie2@test.com",
          password: "123",
        });
        const loginRes = await request(app)
          .post("/api/auth/login")
          .send({ email: "normie2@test.com", password: "123" });

        const res = await request(app)
          .post(`/api/sweets/${sweet._id}/restock`)
          .set("Authorization", `Bearer ${loginRes.body.token}`)
          .send({ quantity: 50 });

        expect(res.statusCode).toEqual(403);
      });
    });
  });
  // ... existing delete tests ...

  describe("Inventory Operations", () => {
    describe("POST /api/sweets/:id/purchase", () => {
      it("should purchase a sweet and decrease quantity", async () => {
        const sweet = await Sweet.create({
          name: "Candy Cane",
          category: "Xmas",
          price: 1,
          quantity: 5,
        });

        const res = await request(app)
          .post(`/api/sweets/${sweet._id}/purchase`)
          .set("Authorization", `Bearer ${token}`)
          .send({ quantity: 1 }); // Buying 1

        expect(res.statusCode).toEqual(200);
        expect(res.body.quantity).toEqual(4);
      });

      it("should fail if sweet is out of stock", async () => {
        const sweet = await Sweet.create({
          name: "Rare Candy",
          category: "Pokemon",
          price: 100,
          quantity: 0,
        });

        const res = await request(app)
          .post(`/api/sweets/${sweet._id}/purchase`)
          .set("Authorization", `Bearer ${token}`)
          .send({ quantity: 1 });

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toMatch(/out of stock/i);
      });
    });

    describe("POST /api/sweets/:id/restock", () => {
      it("should allow admin to restock sweets", async () => {
        const sweet = await Sweet.create({
          name: "Empty Bin",
          category: "Bulk",
          price: 1,
          quantity: 0,
        });

        const res = await request(app)
          .post(`/api/sweets/${sweet._id}/restock`)
          .set("Authorization", `Bearer ${token}`) // Admin token
          .send({ quantity: 50 });

        expect(res.statusCode).toEqual(200);
        expect(res.body.quantity).toEqual(50);
      });

      it("should prevent non-admin from restocking", async () => {
        const sweet = await Sweet.create({
          name: "Empty Bin",
          category: "Bulk",
          price: 1,
          quantity: 0,
        });

        // Create normal user
        const normie = await User.create({
          username: "normie2",
          email: "normie2@test.com",
          password: "123",
        });
        const loginRes = await request(app)
          .post("/api/auth/login")
          .send({ email: "normie2@test.com", password: "123" });

        const res = await request(app)
          .post(`/api/sweets/${sweet._id}/restock`)
          .set("Authorization", `Bearer ${loginRes.body.token}`)
          .send({ quantity: 50 });

        expect(res.statusCode).toEqual(403);
      });
    });
  });
  // ... existing delete tests ...

  describe("Inventory Operations", () => {
    describe("POST /api/sweets/:id/purchase", () => {
      it("should purchase a sweet and decrease quantity", async () => {
        const sweet = await Sweet.create({
          name: "Candy Cane",
          category: "Xmas",
          price: 1,
          quantity: 5,
        });

        const res = await request(app)
          .post(`/api/sweets/${sweet._id}/purchase`)
          .set("Authorization", `Bearer ${token}`)
          .send({ quantity: 1 }); // Buying 1

        expect(res.statusCode).toEqual(200);
        expect(res.body.quantity).toEqual(4);
      });

      it("should fail if sweet is out of stock", async () => {
        const sweet = await Sweet.create({
          name: "Rare Candy",
          category: "Pokemon",
          price: 100,
          quantity: 0,
        });

        const res = await request(app)
          .post(`/api/sweets/${sweet._id}/purchase`)
          .set("Authorization", `Bearer ${token}`)
          .send({ quantity: 1 });

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toMatch(/out of stock/i);
      });
    });

    describe("POST /api/sweets/:id/restock", () => {
      it("should allow admin to restock sweets", async () => {
        const sweet = await Sweet.create({
          name: "Empty Bin",
          category: "Bulk",
          price: 1,
          quantity: 0,
        });

        const res = await request(app)
          .post(`/api/sweets/${sweet._id}/restock`)
          .set("Authorization", `Bearer ${token}`) // Admin token
          .send({ quantity: 50 });

        expect(res.statusCode).toEqual(200);
        expect(res.body.quantity).toEqual(50);
      });

      it("should prevent non-admin from restocking", async () => {
        const sweet = await Sweet.create({
          name: "Empty Bin",
          category: "Bulk",
          price: 1,
          quantity: 0,
        });

        // Create normal user
        const normie = await User.create({
          username: "normie2",
          email: "normie2@test.com",
          password: "123",
        });
        const loginRes = await request(app)
          .post("/api/auth/login")
          .send({ email: "normie2@test.com", password: "123" });

        const res = await request(app)
          .post(`/api/sweets/${sweet._id}/restock`)
          .set("Authorization", `Bearer ${loginRes.body.token}`)
          .send({ quantity: 50 });

        expect(res.statusCode).toEqual(403);
      });
    });
  });
}); // <--- CRITICAL: This closes the main describe block
