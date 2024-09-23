import mongoose from "mongoose";


export const empSchema=new mongoose.Schema({
    userId:{
        type: String,
    },
    name: {
        type: String,
        required: true,

    },
    position:{
        type:String,
        required:true,
    },
    contact:{
        type:String,
        required:true,
    }

})
export default mongoose.model.employeeModels || mongoose.model('employeeModels',empSchema) 