import { useEffect, useState } from "react";
import greenLeave from "../assets/greenLeave.png";
import { AddHabit } from "./AddHabit";
import { Habbits } from "./Habbits";
import clsx from "clsx";
import check from "../assets/check.png";
import trophy from "../assets/trophy.png";
import fire from "../assets/fire.png";
import { DarkModeToggle } from "./DarkModeToggle";
import { profile, deleteHabit, getCompletionDates } from "../api/endpoints";
import { getToken } from "../utils/auth";
import axios from "axios";
export const MainDashboard = () => {
  const [user, setUser] = useState(null); // fetch the current loggedin user
  const [addHabit, setAddHabit] = useState(false);
  const [myhabits, setMyHabits] = useState([]); //fetched the current loggedin user's habits
  const [completedDays, setcompletedDays] = useState({}); //fetched current user's logged in habits completion dates
  const [totalCompletions, setTotalCompletions] = useState(0);
  const [editedHabit, setEditedHabit] = useState(null);
  const [search, setSearch] = useState("");
  const [filteredHabits, setFilteredHabits] = useState([]);
  const [checked, setChecked] = useState(false);
  const [sort, setSort] = useState("");

  const getCurrentUser = async () => {
    const token = getToken();
    try {
      const user = await axios.get(profile, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return user.data;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const loggedUser = async () => {
      const user = await getCurrentUser();
      if (!user) return;
      setUser(user.user);
      setMyHabits(user.habits);
    };
    loggedUser();
  }, []);

  function getHabitStreak(habit) {
    const dates = [...(completedDays[habit._id] || [])].sort();

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

      largestStreak = Math.max(largestStreak, currentStreak);
    }

    return largestStreak;
  }

  function getLargestStreak() {
    let largestStreak = 0;
    let largestStreakHabit = null;

    myhabits.forEach((habit) => {
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
  // get total completions
  useEffect(() => {
    const loadCompletionDates = async () => {
      const token = getToken();

      if (!token || !myhabits?.length) return;

      try {
        const completionData = {};

        for (const habit of myhabits) {
          const response = await axios.get(
            getCompletionDates.replace(":habitId", habit._id),
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          completionData[habit._id] = response.data.dates || [];
        }
        const allDates = Object.values(completionData).flat().length;
        setTotalCompletions(allDates);
      } catch (error) {
        console.log("Error loading completion dates:", error);
      }
    };

    loadCompletionDates();
  }, [myhabits, completedDays]);

  const result = getLargestStreak();
  const removeHabit = async (hid) => {
    try {
      const token = getToken();
      await axios.delete(deleteHabit.replace(":habitId", hid), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMyHabits((prev) => prev.filter((habit) => habit._id !== hid));
    } catch {
      return null;
    }
  };

  const handleSearch = async (e) => {
    const searchValue = e.target.value;
    setSearch(searchValue);
    let searchedHabits = [...myhabits];
    if (searchValue === "") {
      return myhabits;
    }
    if (searchValue) {
      searchedHabits = [...myhabits].filter((habit) =>
        habit.name.toLowerCase().includes(searchValue.toLowerCase()),
      );
    }
    if (checked) {
      searchedHabits = searchedHabits.filter(
        (habit) => getHabitStreak(habit) > 3,
      );
    }

    if (sort === "high") {
      searchedHabits.sort((a, b) => getHabitStreak(b) - getHabitStreak(a));
    }

    if (sort === "low") {
      searchedHabits.sort((a, b) => getHabitStreak(a) - getHabitStreak(b));
    }
    setFilteredHabits(searchedHabits);
  };

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
                    {result.habit?.name.toUpperCase() || "No habit"}
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
              completedDays={completedDays}
              setcompletedDays={setcompletedDays}
              filteredHabits={filteredHabits}
            />
          </div>
        </main>
      </div>
    </div>
  );
};
