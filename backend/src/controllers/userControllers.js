import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Habit } from "../models/habitModel.js";
import { Completed } from "../models/completionModel.js";
import "dotenv/config";

const nameRegex = /^[A-Za-z '-]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,64}$/;

const validateName = (name) => {
  if (typeof name !== "string" || !name.trim()) return "Name is required";
  const cleanedName = name.trim();
  if (cleanedName.length < 3) return "Name should be at least 3 characters";
  if (cleanedName.length > 50) return "Name should not exceed 50 characters";
  if (!nameRegex.test(cleanedName)) return "Invalid name";
  return null;
};

const validatePassword = (password) => {
  if (typeof password !== "string" || !password.trim()) {
    return "Password is required";
  }
  if (!passwordRegex.test(password)) {
    return "Password must be 8-64 characters and contain uppercase, lowercase, number, and special character";
  }
  return null;
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body || {};

  const nameError = validateName(name);
  if (nameError) {
    return res.status(400).json({ message: nameError, isSuccess: false, errorCode: 400 });
  }

  if (typeof email !== "string" || !email.trim()) {
    return res.status(400).json({ message: "Email is required", isSuccess: false, errorCode: 400 });
  }

  const cleanedEmail = email.trim().toLowerCase();
  if (!emailRegex.test(cleanedEmail)) {
    return res.status(400).json({ message: "Invalid email format", isSuccess: false, errorCode: 400 });
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return res.status(400).json({ message: passwordError, isSuccess: false, errorCode: 400 });
  }

  const user = await User.findOne({ email: cleanedEmail });
  if (user) {
    return res.status(409).json({ message: "User already exists", isSuccess: false, errorCode: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({
    name: name.trim(),
    email: cleanedEmail,
    password: hashedPassword,
  });

  res.status(201).json({
    message: "User created successfully",
    isSuccess: true,
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body || {};

  if (typeof email !== "string" || !email.trim() || typeof password !== "string" || !password.trim()) {
    return res.status(400).json({
      message: "Email and Password should not be empty",
      isSuccess: false,
      errorCode: 400,
    });
  }

  const cleanedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: cleanedEmail });

  if (!user) {
    return res.status(404).json({ message: "User not found", isSuccess: false, errorCode: 404 });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: "Invalid email or password", isSuccess: false, errorCode: 401 });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.status(200).json({
    message: "User login successful",
    data: { id: user._id, name: user.name, email: user.email },
    token,
    isSuccess: true,
  });
};

export const userDashboard = async (req, res) => {
  const { id } = req.user;
  const data = await User.findById(id).select("name email createdAt");

  if (!data) {
    return res.status(404).json({ message: "User not found", isSuccess: false, errorCode: 404 });
  }

  const habits = await Habit.find({ userId: id }).sort({ createdAt: -1 });
  const completionDays = await Completed.find({ userId: id });

  res.status(200).json({
    message: "This is user dashboard",
    user: { id: data._id, name: data.name, email: data.email, createdAt: data.createdAt },
    habits,
    completionDays,
  });
};

export const updateName = async (req, res) => {
  const { name } = req.body || {};
  const nameError = validateName(name);

  if (nameError) {
    return res.status(400).json({ message: nameError, isSuccess: false, errorCode: 400 });
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { name: name.trim() },
    { new: true },
  );

  if (!updatedUser) {
    return res.status(404).json({ message: "User not found", isSuccess: false, errorCode: 404 });
  }

  res.status(200).json({
    message: "Name updated successfully",
    isSuccess: true,
    data: { id: updatedUser._id, name: updatedUser.name, email: updatedUser.email },
  });
};

export const updatePassword = async (req, res) => {
  const { password } = req.body || {};
  const passwordError = validatePassword(password);

  if (passwordError) {
    return res.status(400).json({ message: passwordError, isSuccess: false, errorCode: 400 });
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { password: await bcrypt.hash(password, 10) },
    { new: true },
  );

  if (!updatedUser) {
    return res.status(404).json({ message: "User not found", isSuccess: false, errorCode: 404 });
  }

  res.status(200).json({ message: "Password updated successfully", isSuccess: true });
};

export const deleteUser = async (req, res) => {
  const { id } = req.user;
  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: "User not found", errorCode: 404, isSuccess: false });
  }

  await Completed.deleteMany({ userId: id });
  await Habit.deleteMany({ userId: id });
  await User.findByIdAndDelete(id);

  res.status(200).json({ message: "Account deleted successfully", isSuccess: true });
};

export const forgotPasswordStepOne = async (req, res) => {
  const { email } = req.body || {};

  if (typeof email !== "string" || !email.trim()) {
    return res.status(400).json({ message: "Email is required", isSuccess: false, errorCode: 400 });
  }

  const cleanedEmail = email.trim().toLowerCase();
  const validUser = await User.findOne({ email: cleanedEmail });

  if (!validUser) {
    return res.status(404).json({ message: "User not found", isSuccess: false, errorCode: 404 });
  }

  const token = jwt.sign({ id: validUser._id }, process.env.JWT_EMAIL_SECRET, { expiresIn: "10m" });

  res.status(200).json({
    message: "Email found successfully",
    data: { id: validUser._id, email: validUser.email },
    token,
    isSuccess: true,
  });
};

export const forgotPasswordStepTwo = async (req, res) => {
  const { password } = req.body || {};
  const passwordError = validatePassword(password);

  if (passwordError) {
    return res.status(400).json({ message: passwordError, isSuccess: false, errorCode: 400 });
  }

  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found", isSuccess: false, errorCode: 404 });
  }

  await User.findByIdAndUpdate(req.userId, {
    password: await bcrypt.hash(password, 10),
  });

  res.status(200).json({ message: "Password updated successfully", isSuccess: true });
};
