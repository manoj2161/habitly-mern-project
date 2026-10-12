import axios from "axios";
import {
  getCompletionDates,
  addCompletionDate,
  removeCompletionDate,
} from "../api/endpoints";
import { getToken } from "../utils/auth";
import { HabitCard } from "./HabitCard";

export const Habbits = ({
  setAddHabit,
  myhabits,
  setcompletedDays,
  search,
  removeHabit,
  setEditedHabit,
  completedDays,
  filteredHabits,
}) => {
  const todayDate = new Date().toLocaleDateString("en-CA");

  const today = new Date();
  const day = today.getDay();
  const daysFromMonday = day === 0 ? 6 : day - 1;

  today.setDate(today.getDate() - daysFromMonday);

  const weekDays = [];
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  for (let i = 0; i < 7; i++) {
    weekDays.push({
      date: today.toLocaleDateString("en-CA"),
      day: dayNames[i],
    });

    today.setDate(today.getDate() + 1);
  }

  const toggleHabitDay = async (id, date) => {
    const habit = (myhabits || []).find((item) => item._id === id);
    if (!habit) return;

    const token = getToken();
    if (!token) return;

    const currentDates = completedDays[id] || [];
    const isCompleted = currentDates.includes(date);

    try {
      const response = isCompleted
        ? await axios.delete(removeCompletionDate.replace(":habitId", id), {
            data: { date },
            headers: { Authorization: `Bearer ${token}` },
          })
        : await axios.post(
            addCompletionDate.replace(":habitId", id),
            { date },
            { headers: { Authorization: `Bearer ${token}` } },
          );

      setcompletedDays((prev) => ({
        ...prev,
        [id]: response.data.data?.dates || [],
      }));
    } catch (error) {
      console.log("Error toggling habit:", error);
    }
  };

  return (
    <>
      <div>
        <div className="border-gray-200 dark:border-gray-700 border p-3 sm:p-4 rounded-lg shadow-lg bg-white dark:bg-gray-900 mx-1 sm:mx-2">
          <h2 className="text-xl font-bold pl-1 sm:pl-2 mb-4">My Habits</h2>
          <HabitCard
            removeHabit={removeHabit}
            setEditedHabit={setEditedHabit}
            completedDays={completedDays}
            filteredHabits={filteredHabits}
            addHabit={setAddHabit}
            setAddHabit={setAddHabit}
            weekDays={weekDays}
            todayDate={todayDate}
            toggleHabitDay={toggleHabitDay}
            search={search}
            myhabits={myhabits}
          />
        </div>
      </div>
    </>
  );
};
