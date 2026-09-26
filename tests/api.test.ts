import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";
import User from "../src/model/user.model.js";
import Customer from "../src/model/Customer.model.js";
import Mess from "../src/model/Mess.model.js";
import Meal from "../src/model/Meal.model.js";
import Order from "../src/model/order.model.js";

const testEmail = `jest-customer-${Date.now()}@example.com`;
const ownerEmail = `jest-owner-${Date.now()}@example.com`;
const password = "password123";

describe("API endpoint contracts", () => {
  let customerToken: string;
  let ownerToken: string;
  let customerId: mongoose.Types.ObjectId;
  let mealId: mongoose.Types.ObjectId;
  let messId: mongoose.Types.ObjectId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URL as string, {
      dbName: "mummas-kitchen-test",
    });

    const owner = await User.create({
      name: "Jest Mess Owner",
      email: ownerEmail,
      password,
      role: "OWNER",
    });

    customerId = owner._id;

    const mess = await Mess.create({
      ownerId: owner._id,
      name: "Jest Test Kitchen",
      area: "Nashik",
      phone: "9123456789",
      address: "123 Test Kitchen Street, Nashik",
      description: "A test kitchen used for endpoint contract checks.",
      is_Active: true,
    });
    messId = mess._id;

    const meal = await Meal.create({
      messId,
      name: "Jest Test Meal",
      mealType: "lunch",
      is_Veg: true,
      description: "A test meal used for endpoint contract checks.",
      price: 100,
      is_Available: true,
    });
    mealId = meal._id;
  });

  afterAll(async () => {
    await Order.deleteMany({ userId: customerId });
    await Customer.deleteMany({ userId: customerId });
    await Meal.deleteOne({ _id: mealId });
    await Mess.deleteOne({ _id: messId });
    await User.deleteMany({ email: { $in: [testEmail, ownerEmail] } });
    await mongoose.disconnect();
  });

  it("serves the API metadata and public collections", async () => {
    await request(app).get("/about").expect(200);
    await request(app).get("/menu").expect(200);
    await request(app).get("/mess").expect(200);
  });

  it("rejects role input during public registration", async () => {
    await request(app)
      .post("/auth/register")
      .send({
        name: "Invalid Role User",
        email: `invalid-role-${Date.now()}@example.com`,
        password,
        role: "OWNER",
      })
      .expect(400);
  });

  it("registers customers without a role and logs them in", async () => {
    const registration = await request(app).post("/auth/register").send({
      name: "Jest Customer",
      email: testEmail,
      password,
    });

    expect(registration.status).toBe(201);
    expect(registration.body.user.role).toBe("CUSTOMER");
    expect(registration.body.token).toBeDefined();

    const login = await request(app).post("/auth/login").send({
      email: testEmail,
      password,
    });

    expect(login.status).toBe(200);
    expect(login.body.user.role).toBe("CUSTOMER");
    customerToken = login.body.token;
    customerId = new mongoose.Types.ObjectId(login.body.user.id);
  });

  it("redirects a new customer to profile setup through the API contract", async () => {
    const profile = await request(app)
      .get("/profile/customer")
      .set("Authorization", `Bearer ${customerToken}`);

    expect(profile.status).toBe(404);
    expect(profile.body.message).toBe("Customer profile not found");

    const created = await request(app)
      .post("/profile/customer")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ phone: "9876543210", address: "123 Test Street, Nashik" });

    expect(created.status).toBe(201);

    const completed = await request(app)
      .get("/profile/customer")
      .set("Authorization", `Bearer ${customerToken}`);

    expect(completed.status).toBe(200);
    expect(completed.body.profile.isProfileCompleted).toBe(true);
  });

  it("returns the stored owner role without accepting a login role", async () => {
    const login = await request(app).post("/auth/login").send({
      email: ownerEmail,
      password,
    });

    expect(login.status).toBe(200);
    expect(login.body.user.role).toBe("OWNER");
    ownerToken = login.body.token;
  });

  it("creates an order with the authenticated customer ID", async () => {
    const order = await request(app)
      .post("/orders")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({
        items: [{ mealId, quantity: 1, price: 100, selectedExtras: [] }],
        deliveryAddress: "123 Customer Street, Nashik",
        deliveryPhone: "9876543210",
        paymentMethod: "COD",
        paymentStatus: "PENDING",
        status: "PLACED",
      });

    expect(order.status).toBe(201);
    expect(order.body.order.userId.toString()).toBe(customerId.toString());
  });

  it("enforces RBAC and disables singleton mess creation/deletion", async () => {
    await request(app)
      .get("/owner/dashboard/stats")
      .set("Authorization", `Bearer ${customerToken}`)
      .expect(403);

    await request(app)
      .post("/mess")
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({})
      .expect(404);

    await request(app)
      .delete("/mess/000000000000000000000000")
      .set("Authorization", `Bearer ${ownerToken}`)
      .expect(404);
  });

  it("requires authentication for uploads and rejects invalid credentials", async () => {
    await request(app).post("/uploads/image").expect(401);

    await request(app)
      .post("/auth/login")
      .send({ email: testEmail, password: "wrong-password" })
      .expect(401);
  });
});