import  Course  from "../models/Course.js";

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json({
      message: "All courses fetched successfully",
      data: courses,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const addCourse = async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const validationErrors = [];
    if (!title) {
      validationErrors.push("Title is required");
    }
    if (!description) {
      validationErrors.push("Description is required");
    }
    if (!price) {
      validationErrors.push("Price is required");
    }
    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        error: error.message,
      });
    }
    const course = new Course({
      title,
      description,
      price,
    });
    await course.save();
    res.status(200).json({
      message: "Course created successfully",
      data: course,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const {id} = req.params;
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
        error: null,
      });
    }
    await course.deleteOne();
    res.status(200).json({
      message: "Course deleted successfully",
      data: course,
      error: null,
    });
  }
  catch (error) {
    res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
}

const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updateCourseData = req.body;
    const course = await Course.findOneAndUpdate({ _id: id }, updateCourseData, { new: true});
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
        data: null,
        error: null,
      });
    }
    res.status(200).json({
      message: "Course updated successfully",
      data: course,
      error: null,
    });
  }
  catch (error) {
    res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
}

export { addCourse, getAllCourses, deleteCourse, updateCourse };