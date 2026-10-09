import axios from "axios";
import {
  getCompletionDates,
  addCompletionDate,
  removeCompletionDate,
} from "../api/endpoints";
import { getToken } from "../utils/auth";
import { useEffect } from "react";
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
