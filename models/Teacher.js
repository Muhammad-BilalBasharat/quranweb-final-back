import mongoose from "mongoose";
const teacherSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
    updateAt: {
        type: Date,
        default: Date.now,
    },
    userId: {
        type:mongoose.Schema.Types.ObjectId ,
        ref:"User",
    },
})
const Teacher = mongoose.model("Teacher", teacherSchema);
export default Teacher;