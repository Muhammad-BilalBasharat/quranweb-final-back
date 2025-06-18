import User from "../models/Users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRATION } from "../config/envConfig.js"; 1

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      message: "Users fetched successfully",
      data: users,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const id = req.userData.userId;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        data: null,
        error: "User not found",
      });
    }
    res.status(200).json({
      message: "User fetched successfully",
      data: user,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const signupUser = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        message: "Invalid request",
        error: "Request body is missing",
      });
    }
    const { name, email, password, confirmPassword, role } = req.body;

    const errors = [
      !name && "Name",
      !email && "Email",
      !password && "Password",
      !confirmPassword && "Confirm password",
      !role && "Role"
    ]
      .filter(Boolean)
      .map(field => `${field} is required`);

    if (password && confirmPassword && password !== confirmPassword) {
      errors.push("Password and confirm password do not match");
    }
    if (errors.length) {
      return res.status(400).json({ message: "Validation error", error: errors });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
        data: null,
        error: "User already exists",
      });
    }
    //hash password
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        return res.status(500).json({
          message: "Error hashing password",
          error: err.message,
        });
      }
      const user = new User({
        name,
        email,
        password: hash,
        role,
      });
      await user.save();
      const { password, ...userWithoutPassword } = user.toObject();
      res.status(201).json({
        message: "User created successfully",
        data: userWithoutPassword,
        error: null,
      });
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        data: null,
        error: "Email and password are required",
      });
    }
    //check if user exists
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        data: null,
        error: "User not found",
      });
    }

    //check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
        data: null,
        error: "Invalid credentials",
      });
    }

    // user status
    if (user.status === "inactive") {
      return res.status(400).json({
        message: "User is inactive",
        data: null,
        error: "please verify your Email",
      });
    }

    //generate token
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION,
    });

    //send response
    const { password: userPassword, ...userWithoutPassword } = user.toObject();
    res.status(200).json({
      message: "User logged in successfully",
      data: {
        user: userWithoutPassword,
        token,
      },
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const id = req.userData.userId;
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const validationError = [];
    if (!oldPassword) validationError.push("Old password is required");
    if (!newPassword) validationError.push("New password is required");
    if (!confirmPassword) validationError.push("Confirm password is required");
    if (newPassword !== confirmPassword)
      validationError.push("New password and confirm password do not match");
    if (validationError.length > 0) {
      return res.status(400).json({
        message: "Validation error",
        error: validationError,
      });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        data: null,
        error: "User not found",
      });
    }
    //check if old password is correct
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "old password is incorrect",
        data: null,
        error: "old password is incorrect",
      });
    }

    //hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({
      message: "Password changed successfully",
      data: null,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        data: null,
        error: "User not found",
      });
    }
    // Delete the user
    await User.findByIdAndDelete(id);

    res.status(200).json({
      message: "User deleted successfully",
      data: null,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    const validationError = [];
    if (!name) validationError.push("Name is required");
    if (!email) validationError.push("Email is required");
    if (validationError.length > 0) {
      return res.status(400).json({
        message: "Validation error",
        error: validationError,
      })
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        data: null,
        error: "User not found",
      });
    }
    user.name = name;
    user.email = email;
    await user.save();
    res.status(200).json({
      message: "User updated successfully",
      data: user,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

export { getUsers, signupUser, loginUser, changePassword, getUser, deleteUser, updateUser };