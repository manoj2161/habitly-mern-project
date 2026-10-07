import mongoose from "mongoose";

const completionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  habitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "habits",
    required: true,
  },
  dates: {
    type: [String],
    default: [],
  },
});
export const Completed = mongoose.model("completedDays", completionSchema);
