const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
    productId: {type:mongoose.Schema.Types.ObjectId,ref:"products"},
    cartStatus:{type:Number,default:0},
    quantity:{type:Number,default:1},
    user:{type:mongoose.Schema.Types.ObjectId,ref:"users"}
  });
  
const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart