import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Habit } from "../models/habitModel.js";
import { Completed } from "../models/completionModel.js";
import "dotenv/config";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const nameRegex = /^[A-Za-z '-]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,64}$/;
  if (!name || !email || !password) {
    return res.status(400).json({
      isSuccess: false,
      errorMessage: "Invalid data fields",
      errorCode: 400,
    });
  }

  if (name.trim() === "") {
    return res.status(400).json({
      message: "Name should not be empty",
      isSuccess: false,
      errorCode: 400,
    });
  } else if (name.length < 3) {
    return res.status(400).json({
      message: "Name should be atleast 3 characters",
      isSuccess: false,
      errorCode: 400,
    });
  } else if (name.length > 50) {
    return res.status(400).json({
      message: "Name should not exceed 50 characteres",
      isSuccess: false,
      errorCode: 400,
    });
  } else if (!nameRegex.test(name)) {
    return res.status(400).json({
      message: "Invalid name",
      isSuccess: false,
      errorCode: 400,
    });
  }
  if (email.trim() === "") {
    return res.status(400).json({
      message: "Email should not be empty",
      isSuccess: false,
      errorCode: 400,
    });
  } else if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid email format",
      isSuccess: false,
      errorCode: 400,
    });
  }
  if (password.trim() === "") {
    return res.status(400).json({
      message: "Password should not be empty",
      isSuccess: false,
      errorCode: 400,
    });
  } else if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must contain uppercase, lowercase, number, special character, and be 8-64 characters long",
      isSuccess: false,
      errorCode: 400,
    });
  }
  const user = await User.findOne({ email });
  if (user) {
    return res.status(409).json({
      message: "User already exists",
      isSuccess: false,
      errorCode: 409,
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { name, email, password: hashedPassword };
  await User.create(newUser);
  res.status(201).json({
    message: "User created successfully",
    isSuccess: true,
  });
};
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const cleanedEmail = email.trim();
  const cleanedPassword = password.trim();
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and Password should not be empty",
      isSuccess: false,
      errorCode: 400,
    });
  }
  if (!cleanedEmail || !cleanedPassword) {
    return res.status(404).json({
      message: "Email and Password should not be empty",
      isSuccess: false,
      errorCode: 400,
    });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      message: "User not found",
      isSuccess: false,
      errorCode: 404,
    });
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({
      message: "Invalid email or password",
      isSuccess: false,
      errorCode: 401,
    });
  }
  const secret = process.env.JWT_SECRET;
  const token = jwt.sign({ id: user._id }, secret, { expiresIn: "1h" });
  res.status(200).json({
    message: "User login successfull",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token: token,
    isSuccess: true,
  });
};
export const userDashboard = async (req, res) => {
  const { id } = req.user;
  const data = await User.findById(id);
  const habits = await Habit.find({ userId: id });
  const completionDays = await Completed.find({ userId: id });
  if (!data) {
    return res.status(404).json({
      message: "User not found",
      isSuccess: false,
      errorCode: 404,
    });
  }
  res.status(200).json({
    message: "This is user dashboard",
    user: {
      id: data._id,
      name: data.name,
      email: data.email,
    },
    habits,
    completionDays,
  });
};
export const updateName = async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;
  if (!name || !name.trim()) {
    return res.status(400).json({
      message: "Name is required",
      isSuccess: false,
      errorCode: 400,
    });
  }
  const cleanedName = name.trim();
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { name: cleanedName },
    { returnDocument: "after" },
  );
  if (!updatedUser) {
    return res.status(404).json({
      message: "User not found",
      isSuccess: false,
      errorCode: 404,
    });
  }

  res.status(200).json({
    message: "Name updated successfully",
    isSuccess: true,
    data: {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    },
  });
};
export const updatePassword = async (req, res) => {
  const { password } = req.body;
  const userId = req.user.id;
  if (!password || !password.trim()) {
    return res.status(400).json({
      message: "Password is required",
      isSuccess: false,
      errorCode: 400,
    });
  }
  const cleanedPassword = password.trim();
  const hashedPassword = await bcrypt.hash(cleanedPassword, 10);
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      password: hashedPassword,
    },
    { returnDocument: "after" },
  );
  if (!updatedUser) {
    return res.status(404).json({
      message: "User not found",
      isSuccess: false,
      errorCode: 404,
    });
  }
  res.status(200).json({
    message: "Password updated successfully",
    isSuccess: true,
  });
};
export const deleteUser = async (req, res) => {
  const { id } = req.user;
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return res.status(404).json({
      message: "User not found",
      errorCode: 404,
      isSuccess: false,
    });
  }
  await Habit.deleteMany({ userId: id });
  await Completed.deleteMany({ userId: id });
  res.status(200).json({
    message: "Account deleted successfully",
    isSuccess: true,
  });
};
export const forgotPasswordStepOne = async (req, res) => {
  const { email } = req.body;
  if (!email || !email.trim()) {
    return res.status(400).json({
      message: "Email is required",
      isSuccess: false,
      errorCode: 400,
    });
  }
  const cleanedEmail = email.trim();
  const validUser = await User.findOne({ email: cleanedEmail });
  if (!validUser) {
    return res.status(404).json({
      message: "User not found",
      isSuccess: false,
      errorCode: 404,
    });
  }
  const emailSecret = process.env.JWT_EMAIL_SECRET;
  const token = jwt.sign({ id: validUser._id }, emailSecret, {
    expiresIn: "10m",
  });
  res.status(200).json({
    message: "Email found successfully",
    data: {
      id: validUser._id,
      email: validUser.email,
    },
    token: token,
    isSuccess: true,
  });
};
export const forgotPasswordStepTwo = async (req, res) => {
  const userId = req.userId;
  const { password } = req.body;
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,64}$/;
  if (!password) {
    return res.status(400).json({
      isSuccess: false,
      errorMessage: "Password is required",
      errorCode: 400,
    });
  }
  if (password.trim() === "") {
    return res.status(400).json({
      message: "Password should not be empty",
      isSuccess: false,
      errorCode: 400,
    });
  } else if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must contain uppercase, lowercase, number, special character, and be 8-64 characters long",
      isSuccess: false,
      errorCode: 400,
    });
  }
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      message: "User not found",
      isSuccess: false,
      errorCode: 404,
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.findByIdAndUpdate(userId, {
    password: hashedPassword,
  });
  res.status(200).json({
    message: "Password updated successfully",
    isSuccess: true,
  });
};
