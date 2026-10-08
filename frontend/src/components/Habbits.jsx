import { Pencil, Trash2, GripVertical } from "lucide-react";
import { NoHabbit } from "./NoHabbit";
import axios from "axios";
import {
  getCompletionDates,
  addCompletionDate,
  removeCompletionDate,
} from "../api/endpoints";
import { getToken } from "../utils/auth";
import { useEffect } from "react";

export const Habbits = ({
  setAddHabit,
  myhabits,
  removeHabit,
  setEditedHabit,
  completedDays,
  setcompletedDays,
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

  // Load completion dates for all habits
  useEffect(() => {
    const loadCompletionDates = async () => {
      const token = getToken();

      if (!token || !myhabits?.length) return;

      try {
        const responses = await Promise.all(
          myhabits.map((habit) =>
            axios.get(getCompletionDates.replace(":habitId", habit._id), {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
          ),
        );

        const completionData = {};

        myhabits.forEach((habit, index) => {
          completionData[habit._id] = responses[index].data.dates || [];
        });

        setcompletedDays(completionData);
      } catch (error) {
        console.log("Error loading completion dates:", error);
      }
    };

    loadCompletionDates();
  }, [myhabits]);
  const toggleHabitDay = async (id, date) => {
    const habits = myhabits || [];

    const habit = habits.find((habit) => habit._id === id);

    if (!habit) return;

    const token = getToken();

    try {
      const response = await axios.get(
        getCompletionDates.replace(":habitId", id),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      let addDay = response.data.dates || [];

      console.log("Current completed dates:", addDay);

      if (addDay.includes(date)) {
        const updatedDelete = await axios.delete(
          removeCompletionDate.replace(":habitId", id),
          {
            data: {
              date: date,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        addDay = updatedDelete.data.data.dates;

        setcompletedDays((prev) => ({
          ...prev,
          [id]: addDay,
        }));
      } else {
        const completionDates = await axios.post(
          addCompletionDate.replace(":habitId", id),
          {
            date: date,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        addDay = completionDates.data.data.dates;

        setcompletedDays((prev) => ({
          ...prev,
          [id]: addDay,
        }));
      }
    } catch (error) {
      console.log("Error toggling habit:", error);
    }
  };

  return (
    <div>
      <div className="border-gray-200 dark:border-gray-700 border p-3 sm:p-4 rounded-lg shadow-lg bg-white dark:bg-gray-900 mx-1 sm:mx-2">
        <h2 className="text-xl font-bold pl-1 sm:pl-2 mb-4">My Habits</h2>

        {myhabits.length > 0 && (
          <div className="space-y-3">
            {myhabits.map((habit) => (
              <div
                key={habit._id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
              >
                <div className="flex items-center gap-2">
                  <GripVertical className="w-5 text-gray-400 shrink-0" />

                  <p
                    className="w-5 h-5 rounded-full shrink-0"
                    style={{
                      backgroundColor: habit.color,
                    }}
                  />

                  <p className="font-semibold truncate flex-1 min-w-0">
                    {habit.name}
                  </p>

                  <button
                    onClick={() => {
                      setAddHabit(true);
                      setEditedHabit(habit);
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                  >
                    <Pencil className="w-5 text-gray-700 dark:text-gray-300" />
                  </button>

                  <button
                    onClick={() => removeHabit(habit._id)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg"
                  >
                    <Trash2 className="w-5 text-red-500" />
                  </button>
                </div>

                <div className="overflow-x-auto mt-4 pb-1">
                  <div className="flex gap-3 min-w-max justify-center">
                    {weekDays.map((day) => {
                      const isCompleted =
                        completedDays[habit._id]?.includes(day.date) ?? false;

                      return (
                        <div
                          key={day.date}
                          className="flex flex-col items-center gap-1 min-w-10"
                        >
                          <input
                            style={{
                              borderColor: habit.color,
                              backgroundColor: isCompleted
                                ? habit.color
                                : "transparent",
                            }}
                            type="checkbox"
                            checked={isCompleted}
                            disabled={day.date !== todayDate}
                            onChange={() => toggleHabitDay(habit._id, day.date)}
                            className="h-5 w-5 appearance-none rounded-full border-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          />

                          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            {day.day}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {myhabits.length === 0 && (
        <div>
          <NoHabbit addHabit={setAddHabit} />
        </div>
      )}
    </div>
  );
};
