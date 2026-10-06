import { AsideDashboard } from "./AsideDashboard";
import { Pencil, Trash2, GripVertical } from "lucide-react";
import { NoHabbit } from "./NoHabbit";
import { useEffect, useMemo, useState } from "react";
import { AddHabit } from "./AddHabit";
import clsx from "clsx";

export const HabitsPage = () => {
  const [addHabit, setAddHabit] = useState(false);
  const [myhabits, setMyHabits] = useState([]);
  const [editedHabit, setEditedHabit] = useState(null);
  const [search, setSearch] = useState("");
  const [streakFilter, setStreakFilter] = useState(false);
  const [sort, setSort] = useState("");

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const currentUser =
      JSON.parse(localStorage.getItem("currentUser")) ||
      JSON.parse(sessionStorage.getItem("currentUser"));

    const loggedUser = users.find((user) => user.id === currentUser);

    if (loggedUser) {
      setMyHabits(loggedUser.habits || []);
    }
  }, []);

  function removeHabit(hid) {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const currentUser =
      JSON.parse(localStorage.getItem("currentUser")) ||
      JSON.parse(sessionStorage.getItem("currentUser"));

    const loggedUser = users.find((user) => user.id === currentUser);

    if (!loggedUser) return;

    const updatedHabits = (loggedUser.habits || []).filter(
      (habit) => habit.id !== hid,
    );

    loggedUser.habits = updatedHabits;

    localStorage.setItem("users", JSON.stringify(users));

    setMyHabits(updatedHabits);
  }

  function getHabitStreak(habit) {
    const dates = [...(habit.completedDays || [])].sort();

    if (dates.length === 0) {
      return 0;
    }

    let currentStreak = 1;
    let largestStreak = 1;

    for (let i = 1; i < dates.length; i++) {
      const previousDate = new Date(dates[i - 1]);
      const currentDate = new Date(dates[i]);

      const difference = (currentDate - previousDate) / (1000 * 60 * 60 * 24);

      if (difference === 1) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }

      if (currentStreak > largestStreak) {
        largestStreak = currentStreak;
      }
    }

    return largestStreak;
  }

  const displayedHabits = useMemo(() => {
    let habits = [...myhabits];

    if (search.trim()) {
      habits = habits.filter((habit) =>
        habit.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (streakFilter) {
      habits = habits.filter((habit) => getHabitStreak(habit) > 3);
    }

    if (sort === "high") {
      habits.sort((a, b) => getHabitStreak(b) - getHabitStreak(a));
    }

    if (sort === "low") {
      habits.sort((a, b) => getHabitStreak(a) - getHabitStreak(b));
    }

    return habits;
  }, [myhabits, search, streakFilter, sort]);

  return (
    <div className="w-full min-h-screen flex bg-[#fef9f3] dark:bg-gray-950 text-gray-900 dark:text-white transition-colors">
      <div className="w-0 lg:w-[20%] shrink-0">
        <AsideDashboard />
      </div>

      <div className="w-full lg:w-[80%] min-h-screen p-3 sm:p-4 pb-20 lg:pb-4 overflow-x-hidden">
        <div
          className={clsx(
            addHabit && "opacity-25 pointer-events-none",
            "w-full",
          )}
        >
          <main className="w-full">
            <section className="flex flex-col lg:flex-row gap-3 lg:items-center shadow rounded-lg p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <input
                type="search"
                placeholder="Search Habit"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border rounded border-gray-300 dark:border-gray-600 bg-transparent w-full lg:w-64 pl-3 py-2 focus:outline-none focus:border-[#c64d26]"
              />

              <label className="flex items-center gap-2 text-sm sm:text-base cursor-pointer">
                <input
                  type="checkbox"
                  checked={streakFilter}
                  onChange={(e) => setStreakFilter(e.target.checked)}
                  className="accent-orange-400"
                />

                <span>Streak greater than 3 days</span>
              </label>

              <select
                name="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded p-2 bg-white dark:bg-gray-800 lg:ml-auto focus:outline-none"
              >
                <option value="">Sort by</option>
                <option value="high">High to Low</option>
                <option value="low">Low to High</option>
              </select>
            </section>

            <div className="border-gray-200 dark:border-gray-700 border p-3 sm:p-4 rounded-lg shadow-lg bg-white dark:bg-gray-900 mt-4">
              <h2 className="text-xl font-bold mb-4">My Habits</h2>

              <div className="space-y-3">
                {displayedHabits.map((habit) => (
                  <div
                    key={habit.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <GripVertical className="w-5 text-gray-400 shrink-0" />

                      <p
                        className="w-5 h-5 rounded-full shrink-0"
                        style={{
                          backgroundColor: habit.color,
                        }}
                      />

                      <p className="font-semibold truncate">{habit.name}</p>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 sm:w-24">
                      {getHabitStreak(habit)} days
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditedHabit(habit);
                          setAddHabit(true);
                        }}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <Pencil className="w-5 text-gray-700 dark:text-gray-300" />
                      </button>

                      <button
                        onClick={() => removeHabit(habit.id)}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        <Trash2 className="w-5 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {displayedHabits.length === 0 && (
              <NoHabbit addHabit={setAddHabit} />
            )}
          </main>
        </div>

        {addHabit && (
          <AddHabit
            setAddHabit={setAddHabit}
            setMyHabits={setMyHabits}
            editedHabit={editedHabit}
            setEditedHabit={setEditedHabit}
          />
        )}
      </div>
    </div>
  );
};
