import Teacher from "../models/Teacher.js";

const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json({
      message: "All teachers fetched successfully",
      data: teachers,
      error: null,
    });
  } catch (error) {
    res.Status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const addTeacher = async (req, res) => {
  try {
    const {userId}=req.userData;
    
    const { name, email, phone} = req.body;
    const validationErrors = [];
    if (!name) {
      validationErrors.push("Name is required");
    }
    if (!email) {
      validationErrors.push("Email is required");
    }
    if (!phone) {
      validationErrors.push("Phone is required");
    }
    if (validationErrors.length > 0) {
      res.status(400).json({
        message: "validation errors",
        data: null,
        error: validationErrors,
      });
    }
    const teacher = new Teacher({
      name,
      email,
      phone,
      userId,
    });
    await teacher.save();
    res.status(201).json({
      message: "Teacher added successfully",
      data: teacher,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const {userId}=req.userData;
    const updatedData = req.body;
    const teacher = await Teacher.findOneAndUpdate(
      { _id: id,userId:userId },
      updatedData,
      { new: true },
    );
    if (!teacher) {
      res.status(404).json({
        message: "Teacher not found",
        data: null,
        error: null,
      });
    }
    res.status(200).json({
      message: "Teacher updated successfully",
      data: teacher,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const {userId}=req.userData;
    const teacher = await Teacher.findOneAndDelete(
      { _id: id,userId:userId },
    );
    if (!teacher) {
      res.status(404).json({
        message: "Teacher not found",
        data: null,
        error: null,
      });
    }
    res.status(200).json({
      message: "Teacher deleted successfully",
      data: teacher,
      error: null,
    });
    
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

export { getTeachers, addTeacher, updateTeacher, deleteTeacher };
