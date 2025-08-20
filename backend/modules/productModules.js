const mongoose = require('mongoose');

const productSchem = new mongoose.Schema({
     name:{
        type:String,
        required:[true,"Please Enter Product Name"],
        trime:true,
        maxLength:[200,"product name cannot exced 100 character"],

     },
     price:{
        type:Number,
        required:true,
        default:0.0                            
     },
     description:{
         type:String,
         required:[true,"please enter product description"]                          
     },
     brandName:{
         type:String,
         required:[true,"please enter product brand name"]                          
     },
     ratings:{
         type:Number,
         default:0                          
     },
     images:[
       {type:String}                      
     ],
     category:{
         type:String,
         required:[true,"please enter product category"],                        
     },
     specifications:[
         {type:String, required:[true,'please enter product specifications'] }
                                  
     ],
     returnPolicy:{
         type:String,
         required:[true,'please enter product return policy']                           
     },
     warranty:{
         type:String,
         required:[true,'please enter product warranty']                           
     },
     productStatus:{
          type:Number,
          default:0
     },
     offer:{
        type:Number,
        default:0
     },
     discount:{
         type:Number,
         default:0
     },
     discountStatus:{
         type:Boolean,
         default:false
     },
     totalOrders:{
        type:Number,
        default:0
     },
     revenue:{
        type:Number,
        default:0
     },
     stock:{
         type:Number,
         required:[true,'please enter product stock'],                         
     },
     numOfReviews:{
         type:Number,
         default:0                          
     },
     reviews:[
         {
             user:{
                type:mongoose.Schema.Types.ObjectId,
                 ref:"users"
             },                
                name:{
                    type:String,
                    required:true
                },
             rating:{
                 type:Number,
                 required:true                  
             },
             comment:{
               type:String,
               required:true                    
             }                      
         }                          
     ],
     ratings:{
         type:Number,
         default:0                          
     },
     user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
     }                             
},{timestamps:true})
let schema = mongoose.model('products',productSchem)
module.exports = schema