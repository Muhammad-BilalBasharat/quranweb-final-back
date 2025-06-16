import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
 isActive: {
    type: Boolean,
    default: true,
  },
  imageLink: {
    type: String,
  },
  deleteAt: {
    type: Date,
    default: null,
  },
});

const Course = mongoose.model("Course", courseSchema);

export default Course;
