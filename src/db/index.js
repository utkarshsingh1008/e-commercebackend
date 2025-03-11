import mongoose from "mongoose";
import {db_name} from "../constant.js";
const dbConnect = async () => {
    try{  const db = await mongoose.connect(`${process.env.MONGODB_URI}/${db_name}`);
    console.log("Database connected");
}
catch(error){
console.log(error);
}
}


export default dbConnect;