import girlImage from "../assets/girlImage.png";

export const NoHabbit = ({ addHabit }) => {
  return (
    <div className="mt-4 border-gray-200 dark:border-gray-700 border flex flex-col sm:flex-row justify-center items-center mx-1 sm:mx-2 shadow-md rounded-md bg-[#fdf9f3] dark:bg-gray-900 dark:text-white gap-5 sm:gap-10 p-5 sm:p-6 text-center sm:text-left">
      <div>
        <img src={girlImage} alt="" className="w-36 sm:w-48" />
      </div>

      <div className="flex flex-col gap-3 items-center sm:items-start">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">No habits yet!</h1>

          <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
            Add your first habit and
            <br />
            start your self love journey
          </p>
        </div>

        <button
          onClick={() => addHabit((prev) => !prev)}
          className="bg-[#dd4b25] hover:bg-[#b83d1d] p-2.5 px-4 rounded-md text-white text-sm shadow-md transition"
        >
          + Add Habit
        </button>
      </div>
    </div>
  );
};
