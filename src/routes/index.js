const express = require("express");
const router = express.Router();
const productsRoute = require("./products.route");

router.use("/api/products", productsRoute);

module.exports = router;
