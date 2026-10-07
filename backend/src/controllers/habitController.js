import { Completed } from "../models/completionModel.js";
import { Habit } from "../models/habitModel.js";
export const createHabit = async (req, res) => {
  const { name, color } = req.body;
  const cleanedName = name.trim();
  if (!cleanedName || !color) {
    return res.status(400).json({
      message: "Invalid fields",
      isSuccess: false,
      errorCode: 400,
    });
  }
  const habit = await Habit.findOne({ userId: req.user.id, name: cleanedName });
  if (habit) {
    return res.status(409).json({
      message: "Habit already exits",
      isSuccess: false,
      errorCode: 409,
    });
  }
  const newHabit = {
    userId: req.user.id,
    name,
    color,
  };
  await Habit.create(newHabit);
  res.status(201).json({
    message: "Habit created successfully",
    isSuccess: true,
  });
};
export const completedDays = async (req, res) => {
  const { habitId } = req.params;
  const { id } = req.user;
  const date = req.body.date;
  if (!date) {
    return res.status(400).json({
      message: "Date is required",
      isSuccess: false,
      errorCode: 400,
    });
  }
  const isHabtiAvailable = await Habit.findOne({
    _id: habitId,
    userId: id,
  });
  if (!isHabtiAvailable) {
    return res.status(404).json({
      message: "Habit not found",
      isSuccess: false,
      errorCode: 404,
    });
  }
  const completedDates = await Completed.findOneAndUpdate(
    {
      userId: id,
      habitId,
    },
    {
      $addToSet: {
        dates: date,
      },
    },
    {
      returnDocument: "after",
      upsert: true,
    },
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
  const date = req.body.date;
  if (!date) {
    return res.status(400).json({
      message: "Date is required",
      isSuccess: false,
      errorCode: 400,
    });
  }
  const isHabtiAvailable = await Habit.findOne({
    _id: habitId,
    userId: id,
  });
  if (!isHabtiAvailable) {
    return res.status(404).json({
      message: "Habit not found",
      isSuccess: false,
      errorCode: 404,
    });
  }
  const removeCompletedDate = await Completed.findOneAndUpdate(
    {
      userId: id,
      habitId,
    },
    {
      $pull: {
        dates: date,
      },
    },
    {
      returnDocument: "after",
    },
  );
  if (!removeCompletedDate) {
    return res.status(404).json({
      message: "Completion record not found",
      isSuccess: false,
      errorCode: 404,
    });
  }
  res.status(200).json({
    message: "Habit day removed successfully",
    isSuccess: true,
    data: removeCompletedDate,
  });
};
export const updateHabit = async (req, res) => {
  const { name, color } = req.body;
  const { habitId } = req.params;
  const userId = req.user.id;

  if (!name || !name.trim() || !color) {
    return res.status(400).json({
      message: "Invalid data",
      isSuccess: false,
      errorCode: 400,
    });
  }
  const cleanedName = name.trim();
  const cleanedColor = color.trim();
  const isHabtiAvailable = await Habit.findOne({
    _id: habitId,
    userId,
  });
  if (!isHabtiAvailable) {
    return res.status(404).json({
      message: "Habit not found",
      isSuccess: false,
      errorCode: 404,
    });
  }
  await Habit.findByIdAndUpdate(
    habitId,
    {
      name: cleanedName,
      color: cleanedColor,
    },
    {
      returnDocument: "after",
    },
  );
  res.status(200).json({
    message: "Habit updated successfully",
    isSuccess: true,
  });
};
export const deleteHabit = async (req, res) => {
  const { habitId } = req.params;
  const { id } = req.user;
  const deletedHabits = await Habit.findOneAndDelete({
    _id: habitId,
    userId: id,
  });

  if (!deletedHabits) {
    return res.status(404).json({
      message: "Habit not found",
      isSuccess: false,
      errorCode: 404,
    });
  }
  const deletedCompletionDates = await Completed.findOneAndDelete({
    habitId,
    userId: id,
  });
  res.status(200).json({
    message: "Habit removed successfully",
    isSuccess: true,
  });
};
export const getCompletedDates = async (req, res) => {
  const { habitId } = req.params;
  const { id } = req.user;
  const completionDates = await Completed.findOne({
    habitId,
    userId: id,
  });
  res.status(200).json({
    message: "Completion dates fetched",
    isSuccess: true,
    dates: completionDates ? completionDates.dates : [],
  });
};
