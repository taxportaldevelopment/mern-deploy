const mongoose = require("mongoose");
const crypto = require("crypto");
const userSchema = new mongoose.Schema({
     firstname:{
         type:String,
         required:[true,"please enter first name"]
     },
     lastname:{
         type:String,
         required:[true,"please enter last name"]
     },
     email:{
         type:String,
         required:[true,"please enter email"]
     },
     password:{
        type:String,
        required:[true,"please enter password"]
     },
     gender:{
        type:String,
     },
     profileImg:{
        type:String                 
     },
     phoneNumber:{
        type:String,
     },
     role:{
         type:String,
         default:'user'                        
     },
     resetPasswordToken:String,
     resetPasswordTokenExpire:Date,

     accountStatus:{
        type:Number,
        default:0
     },
     resetPasswordToken:String,
     resetPasswordTokenExpire:Date,
},{timestamps:true});

userSchema.methods.getResetToken = function(){
   //Generate Token

  const token = crypto.randomBytes(20).toString('hex');

  //Generate Hash set to resetPasswordToken
 this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex')

 //set token expire time
 this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000;

 return token
} 

const userModule = mongoose.model("users",userSchema);

module.exports = userModule;