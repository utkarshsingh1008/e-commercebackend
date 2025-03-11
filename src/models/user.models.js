import mongoose from "mongoose"; 
import bcrypt from "bcrypt";
import crypto from "crypto";
//!mdbgum
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
   
    password:{
        type:String,
        required:true,
    },
    role: {
        type: String,
        default: "admin",
    },
    cart: {
        type: Array,
        default: [],
    },
    address:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
    }],
     isBlocked: {
         type:  Boolean,
         default: false
     },
     
    wishlist:[ {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",   
    }],
    refreshToken: {
        type: String,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
    
});
userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    const password = this.password;
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(password, salt);
    this.passwordChangedAt = Date.now(); 
})

userSchema.methods.isValidPassword = async function(password){
    return await bcrypt.compare(password, this.password);
}
userSchema.methods.createPasswordResetToken = function(){
   const resetToken = crypto.randomBytes(32).toString('hex'); 
   this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
   this.passwordResetExpires = Date.now() + 3 * 60 * 1000;
   return resetToken;
}
//Export the model
export default mongoose.model('User', userSchema);