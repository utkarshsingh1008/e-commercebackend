import mongoose from "mongoose"; 

// Declare the Schema of the Mongo model
var coupanSchema  = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        uppercase: true,
    },
    expiry:{
        type:Date,
    
    },
   
    discount:{
        type:Number,
        required:true,
    },
});

//Export the model
export default mongoose.model('Coupan', coupanSchema);