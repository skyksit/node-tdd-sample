const request = require("supertest");
const app = require("../../app");
const newProduct = require("../data/new-product.json");
const mongoose = require("mongoose");

let firstProduct;

describe("Product Integration Test", () => {
  beforeAll(async () => {
    const uri = process.env.MONGO_URI;
    await mongoose
      .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => console.log("Mongdo DB Connected..."))
      .catch((error) => console.error(error));
  });

  afterAll(async () => {
    await mongoose.disconnect();
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

  it("GET id does not exist /api/products/:productId", async () => {
    const response = await request(app).get(
      "/api/products/614bc2b8c2473eb691af09d8"
    );
    expect(response.statusCode).toBe(404);
  });

  it("PUT /api/products", async () => {
    const response = await request(app)
      .put("/api/products/" + firstProduct._id)
      .send({
        name: "updated name",
        description: "updated description",
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe("updated name");
    expect(response.body.description).toBe("updated description");
  });

  it("should return 404 on PUT /api/products", async () => {
    const response = await request(app)
      .put("/api/products" + "614bc2b8c2473eb691af09d8")
      .send({
        name: "updated name",
        description: "updated description",
      });
    expect(response.statusCode).toBe(404);
  });

  it("DELETE /api/products", async () => {
    const response = await request(app)
      .delete("/api/products/" + firstProduct._id)
      .send();
    console.log(`firstProduct._id = ${firstProduct._id}`);
    expect(response.statusCode).toBe(200);
  });

  it("DELETE id non-exist /api/products/:productId", async () => {
    const response = await request(app)
      .delete("/api/products/" + firstProduct._id)
      .send();
    expect(response.statusCode).toBe(404);
  });
});
