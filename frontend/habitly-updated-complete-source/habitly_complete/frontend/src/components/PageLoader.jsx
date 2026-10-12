import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const PageLoader = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!loading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#fef9f3] dark:bg-gray-950">
      <div className="flex flex-col items-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#f3d8c8] border-t-[#c64d26]" />
        <h2 className="mt-4 text-lg font-bold text-gray-800 dark:text-white">
          SelfLove
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Loading...
        </p>
      </div>
    </div>
  );
};
