const mongoose=require("mongoose")
const config=require("config")
const db=config.get("mongoURI")
const connectDB=async()=>{
    try{
 await mongoose.connect(db)
 console.log('mongoDB connect...')
    }
    catch(err){
      console.error(err.message)
    }
}

module.exports=connectDB;