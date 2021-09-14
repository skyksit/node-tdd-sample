const request = require("supertest");
const app = require("../../app");
const newProduct = require("../data/new-product.json");
const mongoose = require("mongoose");

let firstProduct;

describe("Product Integration Test", () => {
  beforeAll(async () => {
    const url = process.env.MONGO_URI;
    await mongoose
      .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => console.log("Mongdo DB Connected..."))
      .catch((error) => console.error(error));
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await new Promise((resolve) => setTimeout(() => resolve(), 500));
  });

  it("POST /api/products", async () => {
    const response = await request(app).post("/api/products").send(newProduct);

    expect(response.statusCode).toBe(201);
    expect(response.body.name).toBe(newProduct.name);
    expect(response.body.description).toBe(newProduct.description);
  });

  it("should return 500 on POST /api/products", async () => {
    const response = await request(app)
      .post("/api/products")
      .send({ name: "Ramen" });
    expect(response.statusCode).toBe(500);
    expect(response.body).toStrictEqual({
      message:
        "Product validation failed: description: Path `description` is required.",
    });
  });

  it("GET /api/products", async () => {
    const response = await request(app).get("/api/products");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0].name).toBeDefined();
    expect(response.body[0].description).toBeDefined();

    firstProduct = response.body[0];
  });

  it("GET /api/products/:productId", async () => {
    const response = await request(app).get(
      "/api/products/" + firstProduct._id
    );
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(firstProduct.name);
    expect(response.body.description).toBe(firstProduct.description);
  });
});
