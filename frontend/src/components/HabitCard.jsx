import { Pencil, Trash2, GripVertical } from "lucide-react";
import { NoHabbit } from "./NoHabbit";
export const HabitCard = ({
  removeHabit,
  setEditedHabit,
  completedDays,
  filteredHabits,
  setAddHabit,
  weekDays,
  todayDate,
  toggleHabitDay,
  search,
  myhabits,
}) => {
  let result;

  if (search !== "") {
    result = filteredHabits;
  } else {
    result = myhabits;
  }
  return (
    <>
      {result.length > 0 ? (
        <div className="space-y-3">
          {result.map((habit) => (
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
      ) : (
        result.length === 0 && (
          <div>
            <NoHabbit addHabit={setAddHabit} />
          </div>
        )
      )}
    </>
  );
};
