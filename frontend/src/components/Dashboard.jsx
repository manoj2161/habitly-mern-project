import { AsideDashboard } from "./AsideDashboard";
import { MainDashboard } from "./MainDashboard";

export const Dashboard = () => {
  return (
    <div className="w-full min-h-screen flex bg-[#fef9f3] dark:bg-gray-950 text-gray-900 dark:text-white transition-colors">
      <div className="w-0 lg:w-[20%] shrink-0">
        <AsideDashboard />
      </div>

      <div className="w-full lg:w-[80%] min-h-screen p-3 sm:p-4 pb-20 lg:pb-4 overflow-x-hidden">
        <MainDashboard />
      </div>
    </div>
  );
};
