import { useEffect, useState } from "react";
import { WifiOff, Wifi } from "lucide-react";

const OfflineBanner = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showBackOnline, setShowBackOnline] = useState(false);

  useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true);
      setShowBackOnline(false);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setShowBackOnline(true);

      setTimeout(() => {
        setShowBackOnline(false);
      }, 3000);
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (!isOffline && !showBackOnline) {
    return null;
  }

  return (
    <div
      className={`fixed left-0 right-0 top-0 z-[100] flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white ${
        isOffline ? "bg-[#C7512A]" : "bg-green-600"
      }`}
    >
      {isOffline ? (
        <>
          <WifiOff size={18} />
          <span>No internet connection. Please check your network.</span>
        </>
      ) : (
        <>
          <Wifi size={18} />
          <span>Back online.</span>
        </>
      )}
    </div>
  );
};

export default OfflineBanner;
