import mongoose from "mongoose";

const attendenceSchema = mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    markedBy:{
        type:String,
        required:true
    },
    description:{
        type:String,
        default:""
    }
}, {timestamps: true})

const Attendence = mongoose.model("Attendence", attendenceSchema);

export default Attendence;