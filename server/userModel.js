import mongoose from "mongoose";


export const userSchema=new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique:true,
        match:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    },
    name:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    }

})
export default mongoose.model.userModel || mongoose.model('userModels',userSchema) 