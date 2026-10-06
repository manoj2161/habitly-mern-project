import { useEffect, useState } from "react";
import { AsideDashboard } from "./AsideDashboard";
import {
  GripVertical,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from "lucide-react";
import clsx from "clsx";

export const CalendarPage = () => {
  const [myhabits, setMyHabits] = useState([]);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("users")) || [];

    const loggedUser =
      JSON.parse(localStorage.getItem("currentUser")) ||
      JSON.parse(sessionStorage.getItem("currentUser"));

    const existingUser = data.find((user) => user.id === loggedUser);

    if (!existingUser) {
      return;
    }

    setMyHabits(existingUser.habits || []);
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const firstDay = new Date(year, month, 1);

  const startingEmptyDays = (firstDay.getDay() + 6) % 7;

  const calendarDays = [];

  for (let i = 0; i < startingEmptyDays; i++) {
    calendarDays.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  function nextMonth() {
    const date = new Date(currentDate);
    date.setMonth(month + 1);
    setCurrentDate(date);
  }

  function previousMonth() {
    const date = new Date(currentDate);
    date.setMonth(month - 1);
    setCurrentDate(date);
  }

  return (
    <div className="w-full min-h-screen flex bg-[#fef9f3] dark:bg-gray-950 text-gray-900 dark:text-white transition-colors">
      <div className="w-0 lg:w-[20%] shrink-0">
        <AsideDashboard />
      </div>

      <div className="w-full lg:w-[80%] min-h-screen p-3 sm:p-4 pb-20 lg:pb-4 overflow-x-hidden">
        <div className="flex flex-col sm:flex-row gap-3 items-start">
          <CalendarDays className="size-8 mt-1 text-[#c54c24]" />

          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-bold text-[#c54c24]">
              Calendar
            </h1>

            {selectedHabit ? (
              <div className="text-gray-600 dark:text-gray-300 mt-2">
                <div>
                  Viewing:
                  <span
                    style={{
                      color: selectedHabit.color,
                    }}
                    className="font-bold text-lg sm:text-xl ml-2"
                  >
                    {selectedHabit.name}
                  </span>
                </div>

                <div className="mt-1">
                  Completed Days:
                  <span
                    style={{
                      color: selectedHabit.color,
                    }}
                    className="font-bold text-lg sm:text-xl ml-2"
                  >
                    {selectedHabit.completedDays.length}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-base sm:text-xl my-3 text-gray-600 dark:text-gray-300">
                Select a Habit to get the data
              </div>
            )}
          </div>
        </div>

        <div className="shadow-xl p-3 sm:p-6 lg:p-8 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 mt-5">
          <div className="flex justify-between items-center border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg px-2 sm:px-4 mb-5 max-w-sm mx-auto">
            <button className="p-2 text-[#c54c24]" onClick={previousMonth}>
              <ChevronLeft />
            </button>

            <h2 className="text-sm sm:text-xl font-semibold text-[#c54c24]">
              {monthNames[month]} {year}
            </h2>

            <button className="p-2 text-[#c54c24]" onClick={nextMonth}>
              <ChevronRight />
            </button>
          </div>

          <div className="grid grid-cols-7 text-xs sm:text-base md:text-lg mb-4 place-items-center text-[#c54c24]">
            {dayNames.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 text-xs sm:text-base md:text-lg place-items-center text-[#9d623d] gap-y-4 sm:gap-y-6">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={index} />;
              }

              const dateString = `${year}-${(month + 1)
                .toString()
                .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

              const isCompleted =
                selectedHabit?.completedDays?.includes(dateString);

              const today = new Date();

              const isToday =
                year === today.getFullYear() &&
                month === today.getMonth() &&
                day === today.getDate();

              return (
                <div
                  key={index}
                  style={{
                    backgroundColor: isCompleted
                      ? selectedHabit?.color
                      : undefined,
                  }}
                  className={clsx(
                    "min-w-7 min-h-7 flex items-center justify-center rounded-lg transition",
                    isCompleted && "text-white font-semibold",
                    isToday &&
                      "shadow-lg bg-orange-200 text-[#c54c24] font-bold",
                    "hover:shadow-lg hover:bg-orange-200 hover:text-[#c54c24]",
                  )}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>

        <div className="shadow-lg my-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900">
          <h1 className="text-center p-4 text-2xl sm:text-3xl font-bold">
            My Habits
          </h1>

          <div className="p-2 sm:p-4">
            {myhabits.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-6">
                No habits available
              </p>
            )}

            {myhabits.map((habit) => (
              <div
                key={habit.id}
                className={clsx(
                  selectedHabit?.id === habit.id && "bg-[#9F643D] text-white",
                  "flex flex-col sm:flex-row justify-between gap-3 p-3 sm:py-2 items-start sm:items-center mx-0 sm:mx-2 my-3 shadow-lg border rounded border-gray-300 dark:border-gray-700",
                )}
              >
                <div className="flex gap-3 items-center min-w-0">
                  <GripVertical className="w-5 text-gray-400 shrink-0" />

                  <p
                    className="w-5 h-5 rounded-full shrink-0"
                    style={{
                      backgroundColor: habit.color,
                    }}
                  />

                  <p className="font-semibold truncate">{habit.name}</p>
                </div>

                <button
                  className="p-2 rounded shadow-md bg-orange-100 text-[#c54c24] font-semibold text-sm w-full sm:w-auto"
                  onClick={() => setSelectedHabit(habit)}
                >
                  Click to get Data
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
