const cancelEmail = require("../lib/utils/userCancelEmailSend");
const productOrder = require("../modules/ordersModules");
const Product = require("../modules/productModules");
const { instance } = require("../server");
const crypto = require("crypto");


exports.processPayment = async (req, res) => {
     
   const options = {
      amount:Number(req.body.amount), // Amount in paise
      currency: "INR",
      receipt: `receipt_order_${Math.random() * 10000}`,
      payment_capture: 1 // Auto capture payment
   };

   const order = await instance.orders.create(options);
   if (!order) {
      return res.status(500).json({ success: false, message: "Failed to create payment order" });
   }
   return res.status(200).json({
      success: true,
      message: "Payment order created successfully",
      order
   });
};
// get key for payment
exports.getPaymentKey = (req, res) => {
  try {
    const key = process.env.RAZORPAY_PAI_KEY;
    if (!key) {
      return res.status(500).json({ success: false, message: "Payment key not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Payment key retrieved successfully",
      key
    });
  } catch (error) {
    console.error("Error retrieving payment key:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
// verify payment
exports.verifyPayment = async(req,res)=>{
     try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;

  const expectedSignature = crypto 
    .createHmac('sha256', process.env.RAZORPAY_API_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSignature === razorpay_signature) {
    // Save transaction in DB if needed
    res.status(200).json({ success: true, message: 'Payment verified' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid signature' });
  }
      
     } catch (error) {
        res.status(500).json({ success: false, message: "Payment verification failed", error: error.message });
      
     }
}
// product order controllers
exports.createProductOrder = async (req, res) => {
  try {
    const { quantity, addressLine, city, state, postalCode, country, paymentMethod, phoneNumber } = req.body;
    const productId = req.params.id;

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }

    // Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} item(s) in stock. Please reduce the quantity.`,
      });
    }

    // Create the product order
    const newProductOrder = new productOrder({
      customerId: req.user._id,
      productName: product.name,
      name: req.user.firstname,
      items: [
        {
          productId: productId,
          quantity: quantity,
          price: product.price
        }
      ],
      taxPrice: product.taxPrice,
      totalAmount: (product.price + product.taxPrice) * quantity,
      paymentMethod: paymentMethod,
      phoneNumber: phoneNumber,
      shippingAddress: {
        addressLine,
        city,
        state,
        postalCode,
        country
      }
    });

    const orderProduct = await newProductOrder.save();
    if (!orderProduct) {
      return res.status(400).json({ success: false, error: "Failed to create order" });
    }

    return res.status(201).json({
      success: true,
      message: "Product order created successfully",
      orderProduct
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create product order",
      error: error.message,
    });
  }
};
// product order status change
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Select the order status' });
    }

    const allowedStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', "Returned",'Cancelled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status' });
    }

    // Find the order
    const order = await productOrder.findOne({ orderId }).populate('items.productId');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Update order status
    order.status = status;
    await order.save();

    // If order is delivered, update stock, totalOrders, and revenue
    if (status === 'Delivered') {
      for (const item of order.items) {
        const product = await Product.findById(item.productId._id);
        if (!product) continue;

        // Update stock
        product.stock -= item.quantity;
        if (product.stock <= 0) {
          product.stock = 0;
          product.productStatus = 1; // Out of stock
        }

        // Update totalOrders and revenue
        product.totalOrders += item.quantity;
        product.revenue += item.quantity * product.price;

        await product.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order
    });

  } catch (error) {
    console.error("Error updating order status:", error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
// user address check
exports.getAddressFind = async (req, res) => {
  try {
    const orders = await productOrder.find({ customerId: req.user._id });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: "No orders found" });
    }

    // Keep only the first occurrence for each postalCode
    const uniqueOrders = orders.filter(
      (order, index, self) =>
        index ===
        self.findIndex(
          o => String(o.shippingAddress?.postalCode) === String(order.shippingAddress?.postalCode)
        )
    );

    return res.status(200).json(uniqueOrders);
  } catch (error) {
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
};


// get all product orders
exports.getAllProductOrders = async (req, res) => {
  try {
    // don't return delivered orders
    const orders = await productOrder.find({ status: { $ne: 'Delivered' } }).populate('items.productId').sort({ createdAt: -1 });
    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, message: "No orders found" });
    }
    return res.status(200).json({
      success: true,
      message: "All product orders retrieved successfully",
      orders
    });
  } catch (error) {
    console.error("Error fetching all product orders:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
// order search by name or find query
exports.searchOrderByName = async (req, res) => {
  try {
    const { productName } = req.query;
    if (!productName) {
      return res.status(400).json({ success: false, message: "Name query parameter is required" });
    }

    const orders = await productOrder.find({
      productName: { $regex: productName, $options: 'i' }
    }).populate('items.productId').sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, message: "No orders found for the given name" });
    }

    return res.status(200).json({
      success: true,
      message: "Orders found",
      orders
    });
  } catch (error) {
    console.error("Error searching orders by name:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
// get single product order by id
exports.getSingleProductOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await productOrder.find({_id:orderId}).populate('items.productId');
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    } 
    return res.status(200).json({
      success: true,
      message: "Single product order retrieved successfully",
      order
    });
  } catch (error) {
    console.error("Error fetching single product order:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
// get user product orders
exports.getUserProductOrders = async (req, res) => {
  try {
    const orders = await productOrder.find({ customerId: req.user._id }).populate('items.productId').sort({ createdAt: -1 });
    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, message: "No orders found for this user" });
    }
    return res.status(200).json({
      success: true,
      message: "User product orders retrieved successfully",
      orders
    });
  } catch (error) {
    console.error("Error fetching user product orders:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
// get user single product order
exports.getUserSingleProductOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await productOrder.findOne({ _id: orderId, customerId: req.user._id }).populate('items.productId');
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found for this user" });
    }
    return res.status(200).json({
      success: true,
      message: "User single product order retrieved successfully",
      order
    });
  }
  catch (error) {
    console.error("Error fetching user single product order:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
// update idActive status
exports.updateIdActiveStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await productOrder.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    // Toggle idActive status
    order.idActive = !order.idActive;
    await order.save();
    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order
    });
  } catch (error) {
    console.error("Error updating order status:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
// user cancel order
exports.userCancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await productOrder.findOne({ _id: orderId, customerId: req.user._id });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    // Check if the order is already delivered or cancelled
    if (order.status === 'Delivered' || order.status === 'Cancelled') {
      return res.status(400).json({ success: false, message: "Cannot cancel a delivered or cancelled order" });
    }
    // Update order status to Cancelled
    order.status = 'Cancelled';
    await order.save();
    // Email send to owner
    cancelEmail({
      email: req.user.email,
      subject: "Order Cancelled",
      message: `Order with ID ${order.orderId} has been cancelled by the user ${req.user.firstname}.\n\n Email: ${req.user.email}\nPhone: ${order.phoneNumber}\nAddress: ${order.shippingAddress.addressLine}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`
    });
    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order
    });
  } catch (error) {
    console.error("Error cancelling order:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}