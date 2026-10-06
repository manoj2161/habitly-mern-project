import { useNavigate } from "react-router-dom";

export const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#fef9f3] dark:bg-gray-950 text-gray-900 dark:text-white px-4 text-center">
      <h1 className="text-7xl sm:text-9xl font-bold text-[#c64d26]">404</h1>

      <h3 className="text-xl sm:text-2xl font-semibold mt-3">Page not found</h3>

      <p className="text-gray-500 dark:text-gray-400 mt-2">
        The page you're looking for doesn't exist.
      </p>

      <button
        onClick={() => navigate("/dashboard")}
        className="mt-6 bg-[#c64d26] hover:bg-[#ad401e] text-white px-5 py-2.5 rounded-lg font-semibold transition"
      >
        Go to Dashboard
      </button>
    </div>
  );
};
