import mongoose from "mongoose";

const validateMongodbId = (id) => {

    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if(!isValidId){
        throw new Error("Invalid ID");
    }
}


export default validateMongodbId;