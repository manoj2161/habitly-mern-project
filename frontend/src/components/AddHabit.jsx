import { useEffect, useState } from "react";
import girlImage from "../assets/girlImage.png";
import { Pen, X } from "lucide-react";
import clsx from "clsx";

export const AddHabit = ({
  setAddHabit,
  setMyHabits,
  editedHabit,
  setEditedHabit,
}) => {
  const [habit, setHabit] = useState({
    id: crypto.randomUUID(),
    name: "",
    color: "",
    entryDate: new Date().toLocaleDateString("en-CA"),
    completedDays: [],
  });

  const [errors, setErrors] = useState({});

  const habitColors = [
    "#7FAF6A",
    "#F5A04C",
    "#EF6461",
    "#9B72D9",
    "#5D8FD8",
    "#4DB6B8",
    "#E982B2",
    "#A7A9AC",
  ];

  function handleHabitChange(e) {
    const { name, value } = e.target;

    setHabit((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => {
      const nextErrors = { ...prev };
      delete nextErrors[name];
      return nextErrors;
    });
  }

  function addHabit(e) {
    e.preventDefault();

    const newErrors = {};

    const currentUser =
      JSON.parse(localStorage.getItem("currentUser")) ||
      JSON.parse(sessionStorage.getItem("currentUser"));

    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (!habit.name.trim()) {
      newErrors.name = "Please enter a habit";
    }

    if (!habit.color) {
      newErrors.color = "Please select a color";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const existingUser = users.find((user) => user.id === currentUser);

    if (!existingUser) {
      return;
    }

    if (editedHabit === null) {
      existingUser.habits.push(habit);

      localStorage.setItem("users", JSON.stringify(users));

      setMyHabits([...existingUser.habits]);
      setAddHabit(false);
    }

    if (editedHabit !== null) {
      const habitID = existingUser.habits.findIndex(
        (item) => item.id === editedHabit.id,
      );

      if (habitID === -1) return;

      existingUser.habits[habitID] = {
        ...existingUser.habits[habitID],
        name: habit.name,
        color: habit.color,
      };

      localStorage.setItem("users", JSON.stringify(users));

      setMyHabits([...existingUser.habits]);
      setEditedHabit(null);
      setAddHabit(false);
    }
  }

  useEffect(() => {
    if (editedHabit) {
      setHabit(editedHabit);
    }
  }, [editedHabit]);

  function handleClose() {
    setAddHabit(false);
    setEditedHabit(null);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-center items-center p-3 sm:p-6">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-xl shadow-2xl bg-[#fdfaf2] dark:bg-gray-900 dark:text-white relative">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <X className="text-[#a97c5e]" />
        </button>

        <div className="flex items-center justify-between gap-3 pr-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              {editedHabit === null ? "Add New Habit" : "Edit Habit"}
            </h1>

            <p className="text-sm mt-2 text-[#a8856d] font-semibold">
              Start a new habit and
              <br />
              build a better you.
            </p>
          </div>

          <img src={girlImage} alt="" className="w-28 sm:w-40 shrink-0" />
        </div>

        <div className="flex flex-col gap-5 mt-5">
          <div>
            <label htmlFor="habit-name" className="font-semibold block mb-2">
              Habit Name
            </label>

            <div className="relative">
              <Pen className="absolute left-2 top-1/2 -translate-y-1/2 w-5 text-[#a97c5e] z-10" />

              <input
                type="text"
                name="name"
                id="habit-name"
                value={habit.name}
                onChange={handleHabitChange}
                className="border border-[#a97c5e] rounded-md w-full h-10 pl-8 pr-3 focus:outline-none focus:border-[#c64d26] bg-transparent dark:bg-gray-800"
                placeholder="eg. Drink water"
              />
            </div>

            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <p className="font-semibold mb-4">Choose a color</p>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
              {habitColors.map((color) => (
                <button
                  type="button"
                  key={color}
                  onClick={() => {
                    setHabit((prev) => ({
                      ...prev,
                      color,
                    }));

                    setErrors((prev) => {
                      const nextErrors = {
                        ...prev,
                      };

                      delete nextErrors.color;

                      return nextErrors;
                    });
                  }}
                  style={{
                    backgroundColor: color,
                    outlineStyle: "solid",
                    outlineColor: color,
                    outlineWidth: "2px",
                    outlineOffset: "1px",
                  }}
                  className={clsx(
                    "w-9 h-9 rounded-full shadow-lg border-4",
                    habit.color === color
                      ? "border-black dark:border-black"
                      : "border-gray-200",
                  )}
                />
              ))}
            </div>

            {errors.color && (
              <p className="text-red-500 text-sm mt-2">{errors.color}</p>
            )}
          </div>

          <div className="bg-[#fdf1e5] dark:bg-[#3b2920] rounded-lg p-3">
            <p className="text-[#cb5b42] font-semibold">Tip</p>

            <p className="text-[#a97c5e] dark:text-gray-300 text-sm mt-1">
              Small habits today, big changes tomorrow.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={addHabit}
              className="bg-[#d65b43] hover:bg-[#b74732] rounded-md w-full text-white py-2.5 font-semibold transition"
            >
              {editedHabit === null ? "Add Habit" : "Edit Habit"}
            </button>

            <button
              onClick={handleClose}
              className="bg-[#fdf8f4] dark:bg-gray-800 rounded-md w-full text-[#a1785d] border border-[#a1785d] py-2.5 font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
