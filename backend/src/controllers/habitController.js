import mongoose from "mongoose";
import { Completed } from "../models/completionModel.js";
import { Habit } from "../models/habitModel.js";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const validateHabitId = (habitId) => mongoose.Types.ObjectId.isValid(habitId);
const validateDate = (date) => {
  if (typeof date !== "string" || !dateRegex.test(date)) return false;
  const parsed = new Date(`${date}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
};

export const createHabit = async (req, res) => {
  const { name, color } = req.body || {};

  if (typeof name !== "string" || !name.trim() || typeof color !== "string" || !color.trim()) {
    return res.status(400).json({ message: "Invalid fields", isSuccess: false, errorCode: 400 });
  }

  const cleanedName = name.trim();
  const cleanedColor = color.trim();
  const habit = await Habit.findOne({ userId: req.user.id, name: cleanedName });

  if (habit) {
    return res.status(409).json({ message: "Habit already exists", isSuccess: false, errorCode: 409 });
  }

  const createdHabit = await Habit.create({
    userId: req.user.id,
    name: cleanedName,
    color: cleanedColor,
  });

  res.status(201).json({
    message: "Habit created successfully",
    isSuccess: true,
    habit: createdHabit,
  });
};

export const completedDays = async (req, res) => {
  const { habitId } = req.params;
  const { id } = req.user;
  const { date } = req.body || {};

  if (!validateHabitId(habitId)) {
    return res.status(400).json({ message: "Invalid habit ID", isSuccess: false, errorCode: 400 });
  }

  if (!validateDate(date)) {
    return res.status(400).json({ message: "Invalid date. Use YYYY-MM-DD", isSuccess: false, errorCode: 400 });
  }

  const habit = await Habit.findOne({ _id: habitId, userId: id });
  if (!habit) {
    return res.status(404).json({ message: "Habit not found", isSuccess: false, errorCode: 404 });
  }

  const completedDates = await Completed.findOneAndUpdate(
    { userId: id, habitId },
    { $addToSet: { dates: date } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  res.status(200).json({
    message: "Habit day completed successfully",
    isSuccess: true,
    data: completedDates,
  });
};

export const removeCompletedDays = async (req, res) => {
  const { habitId } = req.params;
  const { id } = req.user;
  const { date } = req.body || {};

  if (!validateHabitId(habitId)) {
    return res.status(400).json({ message: "Invalid habit ID", isSuccess: false, errorCode: 400 });
  }

  if (!validateDate(date)) {
    return res.status(400).json({ message: "Invalid date. Use YYYY-MM-DD", isSuccess: false, errorCode: 400 });
  }

  const habit = await Habit.findOne({ _id: habitId, userId: id });
  if (!habit) {
    return res.status(404).json({ message: "Habit not found", isSuccess: false, errorCode: 404 });
  }

  const completed = await Completed.findOneAndUpdate(
    { userId: id, habitId },
    { $pull: { dates: date } },
    { new: true },
  );

  if (!completed) {
    return res.status(404).json({ message: "Completion record not found", isSuccess: false, errorCode: 404 });
  }

  res.status(200).json({
    message: "Habit day removed successfully",
    isSuccess: true,
    data: completed,
  });
};

export const updateHabit = async (req, res) => {
  const { name, color } = req.body || {};
  const { habitId } = req.params;
  const userId = req.user.id;

  if (!validateHabitId(habitId)) {
    return res.status(400).json({ message: "Invalid habit ID", isSuccess: false, errorCode: 400 });
  }

  if (typeof name !== "string" || !name.trim() || typeof color !== "string" || !color.trim()) {
    return res.status(400).json({ message: "Invalid data", isSuccess: false, errorCode: 400 });
  }

  const cleanedName = name.trim();
  const cleanedColor = color.trim();
  const habit = await Habit.findOne({ _id: habitId, userId });

  if (!habit) {
    return res.status(404).json({ message: "Habit not found", isSuccess: false, errorCode: 404 });
  }

  const duplicate = await Habit.findOne({
    userId,
    name: cleanedName,
    _id: { $ne: habitId },
  });

  if (duplicate) {
    return res.status(409).json({ message: "Habit already exists", isSuccess: false, errorCode: 409 });
  }

  const updatedHabit = await Habit.findByIdAndUpdate(
    habitId,
    { name: cleanedName, color: cleanedColor },
    { new: true },
  );

  res.status(200).json({
    message: "Habit updated successfully",
    isSuccess: true,
    habit: updatedHabit,
  });
};

export const deleteHabit = async (req, res) => {
  const { habitId } = req.params;
  const { id } = req.user;

  if (!validateHabitId(habitId)) {
    return res.status(400).json({ message: "Invalid habit ID", isSuccess: false, errorCode: 400 });
  }

  const deletedHabit = await Habit.findOneAndDelete({ _id: habitId, userId: id });
  if (!deletedHabit) {
    return res.status(404).json({ message: "Habit not found", isSuccess: false, errorCode: 404 });
  }

  await Completed.findOneAndDelete({ habitId, userId: id });

  res.status(200).json({ message: "Habit removed successfully", isSuccess: true });
};

export const getCompletedDates = async (req, res) => {
  const { habitId } = req.params;
  const { id } = req.user;

  if (!validateHabitId(habitId)) {
    return res.status(400).json({ message: "Invalid habit ID", isSuccess: false, errorCode: 400 });
  }

  const habit = await Habit.findOne({ _id: habitId, userId: id });
  if (!habit) {
    return res.status(404).json({ message: "Habit not found", isSuccess: false, errorCode: 404 });
  }

  const completionDates = await Completed.findOne({ habitId, userId: id });

  res.status(200).json({
    message: "Completion dates fetched",
    isSuccess: true,
    dates: completionDates ? completionDates.dates : [],
  });
};
