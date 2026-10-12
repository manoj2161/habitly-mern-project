import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);

    window.dispatchEvent(new Event("darkModeChange"));
  }, [darkMode]);

  useEffect(() => {
    function handleDarkModeChange() {
      setDarkMode(localStorage.getItem("darkMode") === "true");
    }

    window.addEventListener("darkModeChange", handleDarkModeChange);

    return () => {
      window.removeEventListener("darkModeChange", handleDarkModeChange);
    };
  }, []);

  function handleToggle() {
    setDarkMode((prev) => !prev);
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`relative h-7 w-14 rounded-full p-1 transition-colors ${
        darkMode ? "bg-[#c64d26]" : "bg-gray-300"
      }`}
    >
      <div
        className={`flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md transition-transform ${
          darkMode ? "translate-x-7" : "translate-x-0"
        }`}
      >
        {darkMode ? (
          <Moon className="h-3.5 w-3.5 text-gray-700" />
        ) : (
          <Sun className="h-3.5 w-3.5 text-yellow-500" />
        )}
      </div>
    </button>
  );
};
