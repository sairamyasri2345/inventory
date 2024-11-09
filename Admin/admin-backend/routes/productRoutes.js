// admin/backend/routes/productRoutes.js
const express = require("express");
const { addProduct, getProducts,updateProduct,deleteProduct } = require("../controller/productController");

const router = express.Router();

// router.post("/add-product", addProduct);
// router.get("/products", getProducts);
router.post('/add-product', addProduct);
router.get('/products', getProducts);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
