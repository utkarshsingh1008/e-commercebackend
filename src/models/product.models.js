import mongoose from "mongoose"; 

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        
    },
    slug:{
        type:String,
        // required:true,
        unique:true,
        lowercase:true,
    },
  discription:{
      type:String,
      required:true,
  },
  price:{
    type:Number,
    // required:true,
},
  sold:{
      type:Number,
      default:0,
      select: false
  },
  Image:{
     type:String,
    //  required:true,
   
  },
 
  category:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",

  },
  quantity:{
    type:Number,
  },
  color:{
    type:String,
  // required:true,
  },
  brand:{
    type:String,
    //required:true,
  },
  rating: [
    {
      star: Number, 
      comment: String,
      postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  
   totalrating:{
    type:String,
    default:0
   },
  numReviews:{
    type:Number,
    default:0,
  },
  timestamp:{
    type:Date,
    default:Date.now(),
    
  }
});

//Export the model
export default mongoose.model('Product', productSchema);