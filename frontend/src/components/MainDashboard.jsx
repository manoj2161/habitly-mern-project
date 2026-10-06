import { useEffect, useState } from "react";
import greenLeave from "../assets/greenLeave.png";
import { AddHabit } from "./AddHabit";
import { Habbits } from "./Habbits";
import clsx from "clsx";
import check from "../assets/check.png";
import trophy from "../assets/trophy.png";
import fire from "../assets/fire.png";
import { DarkModeToggle } from "./DarkModeToggle";
export const MainDashboard = () => {
  const [user, setUser] = useState(null);
  const [addHabit, setAddHabit] = useState(false);
  const [myhabits, setMyHabits] = useState([]);
  const [editedHabit, setEditedHabit] = useState(null);
  const [search, setSearch] = useState("");
  const [checked, setChecked] = useState(false);
  const [sort, setSort] = useState("");

  function getCurrentUser() {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const currentUser =
      JSON.parse(localStorage.getItem("currentUser")) ||
      JSON.parse(sessionStorage.getItem("currentUser"));

    return users.find((user) => user.id === currentUser);
  }

  useEffect(() => {
    const loggedUser = getCurrentUser();

    if (!loggedUser) return;

    setUser(loggedUser);
    setMyHabits(loggedUser.habits || []);
  }, []);

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

  function getLargestStreak(habits) {
    let largestStreak = 0;
    let largestStreakHabit = null;

    habits.forEach((habit) => {
      const habitStreak = getHabitStreak(habit);

      if (habitStreak > largestStreak) {
        largestStreak = habitStreak;
        largestStreakHabit = habit;
      }
    });

    return {
      streak: largestStreak,
      habit: largestStreakHabit,
    };
  }

  const result = getLargestStreak(myhabits);

  const totalCompletions = myhabits.reduce(
    (acc, habit) => acc + (habit.completedDays?.length || 0),
    0,
  );

  function removeHabit(hid) {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const currentUser =
      JSON.parse(localStorage.getItem("currentUser")) ||
      JSON.parse(sessionStorage.getItem("currentUser"));

    const loggedUser = users.find((user) => user.id === currentUser);

    if (!loggedUser) return;

    const updatedHabits = loggedUser.habits.filter((habit) => habit.id !== hid);

    loggedUser.habits = updatedHabits;

    localStorage.setItem("users", JSON.stringify(users));

    setMyHabits(updatedHabits);
  }

  function handleSearch(e) {
    const searchValue = e.target.value;

    setSearch(searchValue);

    const loggedUser = getCurrentUser();

    if (!loggedUser) return;

    let habits = [...(loggedUser.habits || [])];

    if (searchValue.trim()) {
      habits = habits.filter((habit) =>
        habit.name.toLowerCase().includes(searchValue.toLowerCase()),
      );
    }

    if (checked) {
      habits = habits.filter((habit) => getHabitStreak(habit) > 3);
    }

    if (sort === "high") {
      habits.sort((a, b) => getHabitStreak(b) - getHabitStreak(a));
    }

    if (sort === "low") {
      habits.sort((a, b) => getHabitStreak(a) - getHabitStreak(b));
    }

    setMyHabits(habits);
  }

  function handleChecked(e) {
    const isChecked = e.target.checked;

    setChecked(isChecked);

    const loggedUser = getCurrentUser();

    if (!loggedUser) return;

    let habits = [...(loggedUser.habits || [])];

    if (search.trim()) {
      habits = habits.filter((habit) =>
        habit.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (isChecked) {
      habits = habits.filter((habit) => getHabitStreak(habit) > 3);
    }

    if (sort === "high") {
      habits.sort((a, b) => getHabitStreak(b) - getHabitStreak(a));
    }

    if (sort === "low") {
      habits.sort((a, b) => getHabitStreak(a) - getHabitStreak(b));
    }

    setMyHabits(habits);
  }

  function handleSort(e) {
    const value = e.target.value;

    setSort(value);

    const sortedHabits = [...myhabits];

    if (value === "high") {
      sortedHabits.sort((a, b) => getHabitStreak(b) - getHabitStreak(a));
    }

    if (value === "low") {
      sortedHabits.sort((a, b) => getHabitStreak(a) - getHabitStreak(b));
    }

    setMyHabits(sortedHabits);
  }

  return (
    <div className="relative">
      {addHabit && (
        <AddHabit
          editedHabit={editedHabit}
          setAddHabit={setAddHabit}
          setMyHabits={setMyHabits}
          setEditedHabit={setEditedHabit}
        />
      )}

      <div className={clsx(addHabit && "opacity-25 pointer-events-none")}>
        <main className="w-full">
          <div className="p-2 sm:p-3 rounded-lg">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center sm:justify-between  gap-4 px-2 min-h-16">
              <div className="mb-6 flex items-center justify-between gap-4">
                <DarkModeToggle />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">
                  Welcome, {user?.name}
                </h1>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Keep building your better self
                </p>
              </div>

              <button
                onClick={() => {
                  setEditedHabit(null);
                  setAddHabit(true);
                }}
                className="bg-[#dd4b25] hover:bg-[#b83d1d] p-2.5 px-4 rounded-md text-white text-sm shadow-md transition"
              >
                + Add Habit
              </button>
            </header>

            <section className="grid grid-cols-2 xl:grid-cols-4 gap-3 mt-4">
              <div className="font-semibold shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 min-h-24 p-3 flex justify-center gap-3 items-center rounded-lg">
                <img className="w-12 sm:w-14" src={greenLeave} alt="" />

                <div>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Total Habits
                  </p>
                  <p className="text-xl sm:text-2xl">{myhabits.length}</p>
                </div>
              </div>

              <div className="font-semibold shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 min-h-24 p-3 flex justify-center gap-3 items-center rounded-lg">
                <img src={check} alt="" className="size-10 sm:size-12" />

                <div>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Total Completions
                  </p>
                  <p className="text-xl sm:text-2xl">{totalCompletions}</p>
                </div>
              </div>

              <div className="font-semibold shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 min-h-24 p-3 flex justify-center gap-3 items-center rounded-lg">
                <img src={trophy} alt="" className="size-10 sm:size-12" />

                <div>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Largest Streak
                  </p>
                  <p className="text-xl sm:text-2xl">{result.streak}</p>
                </div>
              </div>

              <div className="font-semibold shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 min-h-24 p-3 flex justify-center gap-3 items-center rounded-lg">
                <img src={fire} alt="" className="size-10 sm:size-12" />

                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Most Streaked
                  </p>

                  <p className="text-sm sm:text-base truncate max-w-24 sm:max-w-32">
                    {result.habit?.name || "No habit"}
                  </p>
                </div>
              </div>
            </section>
          </div>

          <section className="flex flex-col lg:flex-row gap-3 lg:items-center shadow rounded-lg m-2 p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
            <input
              type="search"
              value={search}
              onChange={handleSearch}
              placeholder="Search Habit"
              className="border rounded border-gray-300 dark:border-gray-600 bg-transparent w-full lg:w-64 pl-3 py-2 focus:outline-none focus:border-[#c64d26]"
            />

            <label className="flex items-center gap-2 text-sm sm:text-base cursor-pointer">
              <input
                type="checkbox"
                checked={checked}
                onChange={handleChecked}
                className="accent-orange-400"
              />

              <span>Streak greater than 3 days</span>
            </label>

            <select
              name="sort"
              value={sort}
              onChange={handleSort}
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded p-2 focus:outline-none lg:ml-auto"
            >
              <option value="">Sort by</option>
              <option value="high">High to Low</option>
              <option value="low">Low to High</option>
            </select>
          </section>

          <div className="mt-4">
            <Habbits
              setEditedHabit={setEditedHabit}
              setAddHabit={setAddHabit}
              myhabits={myhabits}
              removeHabit={removeHabit}
              setMyHabits={setMyHabits}
              search={search}
              setSearch={setSearch}
            />
          </div>
        </main>
      </div>
    </div>
  );
};
