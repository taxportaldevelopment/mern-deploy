const express = require("express");
const { addProducts, getAllProducts, getSingleProduct, updateProduct, deleteProduct, productRecover, createReview, getAllReview, getCategory, searchProducts, getRecoverProducts, getFiveStarProducts } = require("../controllers/product.controllers");
const { protectRouter, isAdmin, isSuperAdmin } = require("../middlewares/authenticate");
const routers = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage(); // Store files in memory

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Optional: 5MB limit
});
// update multer storage to use memoryStorage   
const uploads = multer({storage:multer.diskStorage({
      
    destination:function(req,file,cb){
         cb(null,path.join(__dirname,'..','upload/products'))
    },
    filename:function(req,file,cb){
          cb(null,file.fieldname + '-' + Date.now() +Math.floor(Math.random() * 100) +path.extname(file.originalname))                        
    }                              
})})
// Routers

routers.route("/addproduct").post(upload.array("images"),protectRouter,isAdmin,addProducts);
routers.route("/getallproducts").get(getAllProducts);
routers.route("/getsingle-product/:id").get(getSingleProduct);
routers.route("/getsingle-productupdate/:id").put(uploads.array("images"),protectRouter,isAdmin,updateProduct);
routers.route("/getsingle-productdelete/:id").delete(deleteProduct);
routers.route("/getsingle-productrecover/:id").get(protectRouter,isSuperAdmin,productRecover);
routers.route("/product-review/:id").post(protectRouter,createReview);
routers.route("/get/allproduct/:id").get(getAllReview);
routers.route("/get/category").get(getCategory);
routers.route("/get/products/search").get(searchProducts);
routers.route("/get/recoverproducts").get(getRecoverProducts);
routers.route("/getbest/products").get(getFiveStarProducts);

module.exports = routers;