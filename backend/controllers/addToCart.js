const Cart = require("../modules/AddToCart");
// const User = require("../modules/AuthModules");
// add to cart
exports.addToCart = async(req,res)=>{
     try {
        const {quantity} = req.body;
        const  productId = req.params.id;
        let cartItem = await Cart.findOne({productId:productId,cartStatus:1,user:req.user._id });
       
        if(cartItem !== null){ 
        
           if(cartItem.user.toString() == req.user._id.toString()){
              if(cartItem.cartStatus == 1){
                 const addToCart = await Cart.findByIdAndUpdate(cartItem._id,{cartStatus:0,quantity:quantity});
                 if(!addToCart){
                     return res.status(400).json({error:"something went wrong"})
                 }
                 return res.status(200).json({message:"Add to cart successfully"})
              }

           }

        }

       const createCart = await Cart.create({productId:productId,user:req.user._id,quantity:quantity});
       if(!createCart){
          return res.status(400).json({error:"doesn't add to cart"})
       }

       return res.status(200).json({message:"Add to cart successfully"})

     } catch (error) {
        return res.status(500).json({error:error.message})
     }
}
// remove the cart
exports.removeCart = async(req,res)=>{
     try {
           const id = req.params.id;
           let cartItem = await Cart.findOne({productId:id, user:req.user._id });
           if(!cartItem){
                 return res.status(400).json({error:"cart not found"})
           }
            const addToCart = await Cart.findByIdAndUpdate(cartItem._id,{cartStatus:1,quantity:1});
                 if(!addToCart){
                     return res.status(400).json({error:"doesn't remove cart"})
                 }
                 return res.status(200).json({message:"Remove Add to cart successfully",addToCart})
     } catch (error) {
         return res.status(500).json({error:error.message})
     }
}
// get single use all cart
exports.getAllCart = async(req,res)=>{
     try {
       
          const cartFind = await Cart.find({user:req.user._id,cartStatus:0}).populate({
                  path:"productId"
            })

      if(!cartFind){
         return res.status(400).json({error:"something wrong"})
      }
      if(cartFind.length == 0){
           return res.status(400).json({success:false,error:"doesn't cart"})
      }
      return res.status(200).json({success:true,cartFind})
     } catch (error) {
          return res.status(500).json({error:error.message})
     }
}
// get single cart 
exports.getSingleCart = async(req,res)=>{
      try {
         const cartId = req.params.cartid;
         const findId = await Cart.find({productId:cartId,cartStatus:0,user:req.user._id});
         
         if(!findId){
              return res.status(400).json({success:false,error:"Cart Not Found"})
         };
         if(findId.length == 0){
              return res.status(200).json({success:false,message:"data not found",findId})
         }
         return res.status(200).json({success:true,message:findId})
      } catch (error) {
         return res.status(500).json({error:error.message})
      }
}
// quantity update

exports.updateQuantity = async(req,res)=>{
     try {
          const cartId = req.params.cartid;
          const action = req.body.action;
          // Find the cart item by productId and user
          const cartItem = await Cart.findOne({ productId: cartId, user: req.user._id });
      
          if (!cartItem) {
            return res.status(404).json({ error: "Product not found in cart" });
          }
      
          let newQuantity = cartItem.quantity;
      
          if (action === "increment") {
            newQuantity += 1;
          } else if (action === "decrement") {
            if (newQuantity <= 1) {
              return res.status(400).json({ error: "Quantity cannot be less than 1" });
            }
            newQuantity -= 1;
          } else {
            return res.status(400).json({ error: "Invalid update type" });
          }
      
          const updatedCart = await Cart.findByIdAndUpdate(
            cartItem._id,
            { quantity: newQuantity },
            { new: true }
          );
      
          return res.status(200).json({
            message: "Quantity updated successfully",
            cart:updatedCart,
          });
      
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }


}