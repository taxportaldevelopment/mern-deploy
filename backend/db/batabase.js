const mongoose = require("mongoose");

const DatabaseConnect = async()=>{
     try {
        
        const con = await mongoose.connect(process.env.DATABASE_URL);
        console.log(`MongoDB connected: ${con.connection.host}`);
     } catch (error) {
          console.log(`Mongodb is error ${error.message}`);
          process.exit(1)
     }
}
module.exports = DatabaseConnect;