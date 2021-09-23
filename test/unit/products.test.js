const productController = require("../../src/controller/products");
const productModel = require("../../src/models/Product");
const httpMocks = require("node-mocks-http");
const newProduct = require("../data/new-product.json");
const allProducts = require("../data/all-products.json");

productModel.create = jest.fn();
productModel.find = jest.fn();
productModel.findById = jest.fn();
productModel.findByIdAndUpdate = jest.fn();
productModel.findByIdAndDelete = jest.fn();

let req, res, next;
const productId = "6135484a226c194fc726bbc3";
const updatedProduct = {
  name: "updated name",
  description: "updated description",
};

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe("Product Create", () => {
  beforeEach(() => {
    req.body = newProduct;
  });

  it("When Create Product, should have a createProduct function", () => {
    //Assert
    expect(typeof productController.createProduct).toBe("function");
  });

  it("When call controller.create, Should call model.create", async () => {
    //Act
    await productController.createProduct(req, res, next);
    //Assert
    expect(productModel.create).toBeCalledWith(newProduct);
  });

  it("When the product is successfully created, should return a 201", async () => {
    //Act
    await productController.createProduct(req, res, next);
    //Assert
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("When the product is successfully created, should return json body in response", async () => {
    //Arrange
    productModel.create.mockReturnValue(newProduct);
    //Act
    await productController.createProduct(req, res, next);
    //Assert
    expect(res._getJSONData()).toStrictEqual(newProduct);
  });

  it("When product creation fails, Should handle errors", async () => {
    //Arrange
    const errorMessage = { message: "description property missing" };
    const rejectedPromise = Promise.reject(errorMessage);
    productModel.create.mockReturnValue(rejectedPromise);
    //Act
    await productController.createProduct(req, res, next);
    //Assert
    expect(next).toBeCalledWith(errorMessage);
  });
});

describe("Product GetAll", () => {
  it("When Get All Products, should have a getProducts function", () => {
    //Assert
    expect(typeof productController.getProducts).toBe("function");
  });

  it("should call Product.find({})", async () => {
    //Act
    await productController.getProducts(req, res, next);
    //Assert
    expect(productModel.find).toHaveBeenCalledWith({});
  });

  it("should return 200 response", async () => {
    //Act
    await productController.getProducts(req, res, next);
    //Assert
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled).toBeTruthy();
  });

  it("should return json body in response", async () => {
    //Arrange
    productModel.find.mockReturnValue(allProducts);
    //Act
    await productController.getProducts(req, res, next);
    //Assert
    expect(res._getJSONData()).toStrictEqual(allProducts);
  });

  it("should handle errors", async () => {
    //Arrange
    const errorMessage = { message: "Error finding product data" };
    const rejectedPromise = Promise.reject(errorMessage);
    productModel.find.mockReturnValue(rejectedPromise);
    //Act
    await productController.getProducts(req, res, next);
    //Assert
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe("Product GetById", () => {
  it("When Get One Product, should have a getProductById function", () => {
    //Assert
    expect(typeof productController.getProductById).toBe("function");
  });

  it("should call productModel.findById", async () => {
    //Arrange
    req.params.productId = productId;
    //Act
    await productController.getProductById(req, res, next);
    //Assert
    expect(productModel.findById).toBeCalledWith(productId);
  });

  it("should return json body and response code 200", async () => {
    //Arrange
    productModel.findById.mockReturnValue(newProduct);
    //Act
    await productController.getProductById(req, res, next);
    //Assert
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newProduct);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("When item non-exist, should return 404", async () => {
    //Arrange
    productModel.findById.mockReturnValue(null);
    //Act
    await productController.getProductById(req, res, next);
    //Assert
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should handle errors", async () => {
    //Arrange
    const errorMessage = { message: "error" };
    const rejectedPromise = Promise.reject(errorMessage);
    productModel.findById.mockReturnValue(rejectedPromise);
    //Act
    await productController.getProductById(req, res, next);
    //Assert
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe("Product Update", () => {
  it("When Update Product, should have an updateProduct function", () => {
    //Assert
    expect(typeof productController.updateProduct).toBe("function");
  });

  it("should call productMode.findByIdAndUpdate", async () => {
    //Arrange
    req.params.productId = productId;
    req.body = updatedProduct;
    //Act
    await productController.updateProduct(req, res, next);
    //Assert
    expect(productModel.findByIdAndUpdate).toHaveBeenCalledWith(
      productId,
      updatedProduct,
      { new: true }
    );
  });

  it("should return json body and response code 200", async () => {
    //Arrange
    req.params.productId = productId;
    req.body = updatedProduct;
    productModel.findByIdAndUpdate.mockReturnValue(updatedProduct);
    //Act
    await productController.updateProduct(req, res, next);
    //Assert
    expect(res._isEndCalled()).toBeTruthy();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(updatedProduct);
  });

  it("When item non-exist, should handle 404", async () => {
    //Arrange
    productModel.findByIdAndUpdate.mockReturnValue(null);
    //Act
    await productController.updateProduct(req, res, next);
    //Assert
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should handle errors", async () => {
    //Arrange
    const errorMessage = { message: "error" };
    const rejectedPromise = Promise.reject(errorMessage);
    productModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);
    //Act
    await productController.updateProduct(req, res, next);
    //Assert
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe("Product Delete", () => {
  it("When Delete Product, should have an deleteProduct function", () => {
    //Assert
    expect(typeof productController.deleteProduct).toBe("function");
  });

  it("When call deleteProduct, Should call productMode.findByIdAndDelete", async () => {
    //Arrange
    req.params.productId = productId;
    //Act
    await productController.deleteProduct(req, res, next);
    //Assert
    expect(productModel.findByIdAndDelete).toBeCalledWith(productId);
  });

  it("when product deleted, Should return 200 response", async () => {
    //Arrange
    let deletedProduct = {
      name: "deletedProduct",
      description: "it was deleted",
    };
    productModel.findByIdAndDelete.mockReturnValue(deletedProduct);
    //Act
    await productController.deleteProduct(req, res, next);
    //Assert
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(deletedProduct);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("When item non-exist, Should handle 404", async () => {
    //Arrange
    productModel.findByIdAndDelete.mockReturnValue(null);
    //Act
    await productController.deleteProduct(req, res, next);
    //Assert
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("When an error happens, Should manage the errors", async () => {
    //Arrange
    const errorMessage = { message: "Error deleting" };
    const rejectedPromise = Promise.reject(errorMessage);
    productModel.findByIdAndDelete.mockReturnValue(rejectedPromise);
    //Act
    await productController.deleteProduct(req, res, next);
    //Assert
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});