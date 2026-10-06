import girlImage from "../assets/girlImage.png";
import {
  LayoutDashboard,
  ChartNetwork,
  CalendarDays,
  ChartColumn,
  Settings,
  LogOut,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";

export const AsideDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      path: "/myhabits",
      label: "Habits",
      icon: ChartNetwork,
    },
    {
      path: "/calender",
      label: "Calendar",
      icon: CalendarDays,
    },
    {
      path: "/statistics",
      label: "Statistics",
      icon: ChartColumn,
    },
    {
      path: "/settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  function handleLogout() {
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentUser");
    navigate("/");
  }

  return (
    <>
      <aside className="hidden h-screen w-full flex-col justify-between bg-[#fef9f3] shadow-lg transition-colors lg:flex dark:bg-gray-900 dark:text-white">
        <div>
          <div className="flex flex-col items-center">
            <img src={girlImage} alt="SelfLove" className="w-40 xl:w-52" />

            <h1 className="-mt-2 text-xl font-bold">SelfLove</h1>
          </div>

          <nav className="mt-8 flex flex-col gap-2 px-5">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;

              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={clsx(
                    "flex w-full items-center gap-3 rounded-lg p-3 font-semibold transition",
                    active
                      ? "bg-[#fbede3] text-[#c64d26] dark:bg-[#5a2b1c] dark:text-[#c64d26]"
                      : "hover:bg-[#fbede3] hover:text-[#c64d26] dark:hover:bg-gray-800 dark:hover:text-[#c64d26]",
                  )}
                >
                  <Icon className="size-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="mx-5 mb-5 flex items-center gap-3 rounded-lg p-3 font-semibold transition hover:bg-[#fbede3] hover:text-[#c64d26] dark:hover:bg-gray-800 dark:hover:text-[#c64d26]"
        >
          <LogOut className="size-5" />
          Log Out
        </button>
      </aside>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-[#fef9f3] shadow-[0_-4px_15px_rgba(0,0,0,0.08)] lg:hidden dark:border-gray-700 dark:bg-gray-900">
        <div className="grid h-16 grid-cols-5 sm:h-[74px]">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className={clsx(
                  "flex flex-col items-center justify-center gap-1 transition",
                  active
                    ? "text-[#c64d26]"
                    : "text-gray-500 dark:text-gray-400",
                )}
              >
                <Icon
                  className={clsx("size-5 sm:size-6", active && "stroke-[2.5]")}
                />

                <span className="text-[10px] font-semibold sm:text-xs">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
