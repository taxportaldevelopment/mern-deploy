const express = require("express");
const routers = express.Router();
const { createProductOrder, updateOrderStatus, getAddressFind, getAllProductOrders, searchOrderByName, getUserProductOrders, getSingleProductOrder, processPayment, getPaymentKey, verifyPayment, updateIdActiveStatus, userCancelOrder } = require("../controllers/productOrderControllers");
const { protectRouter } = require("../middlewares/authenticate");

routers.route("/order/product/:id").post(protectRouter,createProductOrder);
routers.route("/order/:orderId/status").put(protectRouter,updateOrderStatus);
routers.route("/order/useraddress/check").get(protectRouter,getAddressFind);
routers.route("/allorder").get(protectRouter,getAllProductOrders);
routers.route("/searchproduct").get(protectRouter,searchOrderByName);
routers.route("/author/orders").get(protectRouter,getUserProductOrders);
routers.route("/author/getsingle/order/:orderId").get(protectRouter,getSingleProductOrder);
routers.route("/author/getsingle/order/active/:orderId").get(protectRouter,updateIdActiveStatus);
routers.route("/author/ordercancel/active/:orderId").put(protectRouter,userCancelOrder);
routers.route("/payment/process").post(processPayment);
routers.route("/getkey").get(getPaymentKey);
routers.route("/verify/payment").post(verifyPayment);

module.exports = routers;