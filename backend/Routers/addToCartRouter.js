const express = require("express");
const { addToCart, getAllCart, getSingleCart, removeCart,updateQuantity } = require("../controllers/addToCart");
const { protectRouter } = require("../middlewares/authenticate");
const router = express.Router();

// api cart
router.route("/car/add/:id").post(protectRouter,addToCart);
router.route("/car/add/remove/:id").get(protectRouter,removeCart);
router.route("/car/add/:cartid").get(protectRouter,getSingleCart);
router.route("/car/add/quantity/:cartid").put(protectRouter,updateQuantity);
router.route("/car/getallcart").get(protectRouter,getAllCart);
module.exports = router