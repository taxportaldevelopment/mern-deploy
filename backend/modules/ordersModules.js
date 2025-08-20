const mongoose = require('mongoose');
const shortid = require('shortid'); // npm install shortid

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        default: () => `ORD-${shortid.generate().toUpperCase()}`,
        unique: true
      },
      productName:{
          type:String,
          required:true
      },
      name:{
          type:String
      },
      idActive: {
        type: Boolean,
        default: false
      },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users', // Assumes you have a 'User' model
    required: true
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products', // Assumes you have a 'Product' model
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      price: {
        type: Number,
        required: true
      }
    }
  ],
  taxPrice:{
    type:Number,
    required:true,
    default:0.0                          
} ,
  totalAmount: {
    type: Number,
    required: true
  },
  currency:{
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', "Returned",'Cancelled'],
    default: 'Pending'  
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Card', 'UPI', 'NetBanking'],
    required: true
  },
  phoneNumber:{
     type:String
  },
  shippingAddress: {
    addressLine: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  
},{timestamps: true});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
