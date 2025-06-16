import Student from "../models/Student.js";

const getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json({
      message: "All students fetched successfully",
      data: students,
      error: null,
    });
  } catch (error) {
    res.Status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const addStudent = async (req, res) => {
  try {
    const {userId}=req.userData;
    
    const { name, email, phone } = req.body;
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
      return res.status(400).json({
        message: "Validation failed",
        data: null,
        error: validationErrors,
      })
    }
    const student = new Student({
      name,
      email,
      phone,
      userId,
    })
    await student.save();
    res.status(200).json({
      message: "Student created successfully",
      data: student,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedStudent = req.body;
    const student = await Student.findOneAndUpdate({ _id: id }, updatedStudent, { new: true });
    if (!student) {
      return res.status(404).json({
        message: "Student not found",
        data: null,
        error: null,
      });
    }
    res.status(200).json({
      message: "Student updated successfully",
      data: student,
      error: null,
    });    
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const {userId}=req.userData;
    const student = await Student.findOneAndDelete({ _id: id ,userId:userId});
    if (!student) {
      return res.status(404).json({
        message: "Student not found",
        data: null,
        error: null,
      });
    }
    res.status(200).json({
      message: "Student deleted successfully",
      data: student,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

export { getStudents, addStudent, updateStudent, deleteStudent };
