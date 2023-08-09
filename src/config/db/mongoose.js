const mongoose = require("mongoose")
const config = require("../../config")

// Connecting Database

const connectDb=()=>{
   const db = mongoose.connect(
      config.db,
      { useNewUrlParser: true, useUnifiedTopology: true }
   )
   .then(() => {
      console.log("Connected to database successfully");
   })
   .catch((err) => {
      console.log("Error connecting to MongoDB database", err.message);
   });
   return db;
}


module.exports= {connectDb}