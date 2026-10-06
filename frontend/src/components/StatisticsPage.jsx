import { useEffect, useMemo, useState } from "react";
import {
  Trophy,
  Flame,
  CheckCircle2,
  Target,
  CalendarDays,
  TrendingUp,
} from "lucide-react";
import { AsideDashboard } from "./AsideDashboard";

export const StatisticsPage = () => {
  const [myhabits, setMyHabits] = useState([]);

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

  function getHabitStreak(habit) {
    const dates = [...(habit.completedDays || [])].sort();

    if (dates.length === 0) {
      return 0;
    }

    let currentStreak = 1;
    let largestStreak = 1;

    for (let i = 1; i < dates.length; i++) {
      const previousDate = new Date(`${dates[i - 1]}T00:00:00`);
      const currentDate = new Date(`${dates[i]}T00:00:00`);

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

  function getCurrentStreak(habit) {
    const dates = [...(habit.completedDays || [])].sort();

    if (dates.length === 0) {
      return 0;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let currentStreak = 0;

    for (let i = dates.length - 1; i >= 0; i--) {
      const date = new Date(`${dates[i]}T00:00:00`);
      date.setHours(0, 0, 0, 0);

      const difference = (today - date) / (1000 * 60 * 60 * 24);

      if (difference === currentStreak) {
        currentStreak++;
      } else {
        break;
      }
    }

    return currentStreak;
  }

  const totalCompletions = useMemo(() => {
    return myhabits.reduce(
      (total, habit) => total + (habit.completedDays?.length || 0),
      0,
    );
  }, [myhabits]);

  const bestStreakData = useMemo(() => {
    let bestStreak = 0;
    let bestHabit = null;

    myhabits.forEach((habit) => {
      const streak = getHabitStreak(habit);

      if (streak > bestStreak) {
        bestStreak = streak;
        bestHabit = habit;
      }
    });

    return {
      streak: bestStreak,
      habit: bestHabit,
    };
  }, [myhabits]);

  const currentStreakData = useMemo(() => {
    let currentStreak = 0;
    let currentHabit = null;

    myhabits.forEach((habit) => {
      const streak = getCurrentStreak(habit);

      if (streak > currentStreak) {
        currentStreak = streak;
        currentHabit = habit;
      }
    });

    return {
      streak: currentStreak,
      habit: currentHabit,
    };
  }, [myhabits]);

  const completionRate = useMemo(() => {
    if (myhabits.length === 0) {
      return 0;
    }

    const totalDays = myhabits.reduce(
      (total, habit) => total + (habit.completedDays?.length || 0),
      0,
    );

    const possibleDays = myhabits.reduce((total, habit) => {
      if (!habit.createdAt) {
        return total + 30;
      }

      const created = new Date(habit.createdAt);
      const today = new Date();

      created.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      const days = Math.floor((today - created) / (1000 * 60 * 60 * 24)) + 1;

      return total + Math.max(days, 1);
    }, 0);

    return Math.min(Math.round((totalDays / possibleDays) * 100), 100);
  }, [myhabits]);

  const weeklyData = useMemo(() => {
    const today = new Date();

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);

      date.setDate(today.getDate() - (6 - index));
      date.setHours(0, 0, 0, 0);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      const dateString = `${year}-${month}-${day}`;

      const completed = myhabits.reduce((total, habit) => {
        const completedDays = habit.completedDays || [];

        return total + (completedDays.includes(dateString) ? 1 : 0);
      }, 0);

      return {
        date: dateString,
        day: date.toLocaleDateString("en-US", {
          weekday: "short",
        }),
        completed,
      };
    });
  }, [myhabits]);

  const maxWeeklyCompletion = Math.max(
    ...weeklyData.map((day) => day.completed),
    1,
  );

  const habitPerformance = useMemo(() => {
    return [...myhabits]
      .map((habit) => ({
        ...habit,
        completions: habit.completedDays?.length || 0,
        streak: getHabitStreak(habit),
      }))
      .sort((a, b) => b.completions - a.completions);
  }, [myhabits]);

  const monthlyData = useMemo(() => {
    const today = new Date();

    return Array.from({ length: 6 }, (_, index) => {
      const date = new Date(
        today.getFullYear(),
        today.getMonth() - (5 - index),
        1,
      );

      const month = date.toLocaleDateString("en-US", {
        month: "short",
      });

      const year = date.getFullYear();
      const monthNumber = date.getMonth();

      let completions = 0;

      myhabits.forEach((habit) => {
        (habit.completedDays || []).forEach((completedDate) => {
          const completed = new Date(`${completedDate}T00:00:00`);

          if (
            completed.getMonth() === monthNumber &&
            completed.getFullYear() === year
          ) {
            completions++;
          }
        });
      });

      return {
        month,
        year,
        completions,
      };
    });
  }, [myhabits]);

  const maxMonthlyCompletion = Math.max(
    ...monthlyData.map((month) => month.completions),
    1,
  );

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <div className="flex min-h-screen">
        <div className="hidden w-[20%] lg:block">
          <AsideDashboard />
        </div>

        <main className="w-full px-4 py-5 pb-[100px] sm:px-6 sm:py-6 lg:w-[80%] lg:pb-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl dark:text-white">
                Statistics
              </h1>

              <p className="mt-1 text-sm text-gray-500 sm:text-base dark:text-slate-400">
                Track your progress and see how consistent you have been.
              </p>
            </div>

            {myhabits.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-10 dark:border-slate-700 dark:bg-slate-900">
                <CalendarDays className="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-slate-500" />

                <h2 className="text-xl font-semibold text-gray-700 dark:text-white">
                  No statistics available
                </h2>

                <p className="mt-2 text-sm text-gray-500 sm:text-base dark:text-slate-400">
                  Start completing your habits to see your statistics here.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                          Total Completions
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-gray-800 dark:text-white">
                          {totalCompletions}
                        </h2>
                      </div>

                      <div className="shrink-0 rounded-lg bg-green-100 p-3 dark:bg-green-950">
                        <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                          Current Streak
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-gray-800 dark:text-white">
                          {currentStreakData.streak}
                        </h2>

                        <p className="mt-1 truncate text-xs text-gray-400 dark:text-slate-500">
                          {currentStreakData.habit?.name || "No active streak"}
                        </p>
                      </div>

                      <div className="shrink-0 rounded-lg bg-orange-100 p-3 dark:bg-orange-950">
                        <Flame className="h-6 w-6 text-orange-500 dark:text-orange-400" />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                          Best Streak
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-gray-800 dark:text-white">
                          {bestStreakData.streak}
                        </h2>

                        <p className="mt-1 truncate text-xs text-gray-400 dark:text-slate-500">
                          {bestStreakData.habit?.name || "No streak yet"}
                        </p>
                      </div>

                      <div className="shrink-0 rounded-lg bg-yellow-100 p-3 dark:bg-yellow-950">
                        <Trophy className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                          Completion Rate
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-gray-800 dark:text-white">
                          {completionRate}%
                        </h2>
                      </div>

                      <div className="shrink-0 rounded-lg bg-blue-100 p-3 dark:bg-blue-950">
                        <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
                  <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-700 dark:bg-slate-900">
                    <div className="mb-6 flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                          Weekly Activity
                        </h2>

                        <p className="text-sm text-gray-500 dark:text-slate-400">
                          Your completions during the last 7 days
                        </p>
                      </div>

                      <TrendingUp className="h-5 w-5 shrink-0 text-gray-500 dark:text-slate-400" />
                    </div>

                    <div className="flex h-48 items-end justify-between gap-1 sm:gap-3">
                      {weeklyData.map((day) => (
                        <div
                          key={day.date}
                          className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                        >
                          <span className="mb-2 text-[10px] text-gray-500 sm:text-xs dark:text-slate-400">
                            {day.completed}
                          </span>

                          <div className="flex h-36 w-full items-end">
                            <div
                              className="w-full rounded-t-md bg-green-500 transition-all"
                              style={{
                                height: `${
                                  (day.completed / maxWeeklyCompletion) * 100
                                }%`,
                                minHeight: day.completed > 0 ? "8px" : "2px",
                              }}
                            ></div>
                          </div>

                          <span className="mt-2 text-[10px] text-gray-500 sm:text-xs dark:text-slate-400">
                            {day.day}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-700 dark:bg-slate-900">
                    <div className="mb-6">
                      <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                        Monthly Overview
                      </h2>

                      <p className="text-sm text-gray-500 dark:text-slate-400">
                        Habit completions over the last 6 months
                      </p>
                    </div>

                    <div className="flex h-48 items-end justify-between gap-1 sm:gap-4">
                      {monthlyData.map((month) => (
                        <div
                          key={`${month.year}-${month.month}`}
                          className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                        >
                          <span className="mb-2 text-[10px] text-gray-500 sm:text-xs dark:text-slate-400">
                            {month.completions}
                          </span>

                          <div className="flex h-36 w-full items-end">
                            <div
                              className="w-full rounded-t-md bg-blue-500"
                              style={{
                                height: `${
                                  (month.completions / maxMonthlyCompletion) *
                                  100
                                }%`,
                                minHeight:
                                  month.completions > 0 ? "8px" : "2px",
                              }}
                            ></div>
                          </div>

                          <span className="mt-2 text-[10px] text-gray-500 sm:text-xs dark:text-slate-400">
                            {month.month}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-700 dark:bg-slate-900">
                    <div className="mb-5">
                      <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                        Habit Performance
                      </h2>

                      <p className="text-sm text-gray-500 dark:text-slate-400">
                        Compare your habits
                      </p>
                    </div>

                    <div className="space-y-5">
                      {habitPerformance.map((habit) => (
                        <div key={habit.id}>
                          <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex min-w-0 items-center gap-2">
                              <span
                                className="h-3 w-3 shrink-0 rounded-full"
                                style={{
                                  backgroundColor: habit.color,
                                }}
                              ></span>

                              <span className="truncate text-sm font-medium text-gray-700 dark:text-slate-200">
                                {habit.name}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-slate-400">
                              <span>{habit.completions} completions</span>

                              <span>{habit.streak} day streak</span>
                            </div>
                          </div>

                          <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-slate-800">
                            <div
                              className="h-2 rounded-full bg-green-500"
                              style={{
                                width: `${
                                  totalCompletions > 0
                                    ? (habit.completions / totalCompletions) *
                                      100
                                    : 0
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-700 dark:bg-slate-900">
                    <div className="mb-5">
                      <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                        Streak Leaderboard
                      </h2>

                      <p className="text-sm text-gray-500 dark:text-slate-400">
                        Your habits ranked by best streak
                      </p>
                    </div>

                    <div className="space-y-3">
                      {[...myhabits]
                        .sort((a, b) => getHabitStreak(b) - getHabitStreak(a))
                        .map((habit, index) => (
                          <div
                            key={habit.id}
                            className="flex items-center justify-between gap-3 rounded-lg bg-gray-50 p-3 dark:bg-slate-800"
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-600 dark:bg-slate-700 dark:text-slate-300">
                                {index + 1}
                              </span>

                              <span
                                className="h-3 w-3 shrink-0 rounded-full"
                                style={{
                                  backgroundColor: habit.color,
                                }}
                              ></span>

                              <span className="truncate font-medium text-gray-700 dark:text-slate-200">
                                {habit.name}
                              </span>
                            </div>

                            <div className="flex shrink-0 items-center gap-1 text-orange-500">
                              <Flame className="h-4 w-4" />

                              <span className="text-sm font-semibold">
                                {getHabitStreak(habit)}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      <div className="lg:hidden">
        <AsideDashboard />
      </div>
    </div>
  );
};
