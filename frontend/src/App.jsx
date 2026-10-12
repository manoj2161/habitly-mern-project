import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Login } from "./components/Login";
import { SignUp } from "./components/SignUp";
import { Dashboard } from "./components/Dashboard";
import { HabitsPage } from "./components/HabitsPage";
import { CalendarPage } from "./components/CalenderPage";
import { StatisticsPage } from "./components/StatisticsPage";
import { SettingsPage } from "./components/SettingsPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PageLoader } from "./components/PageLoader";
import { ForgotPassword } from "./components/ForgotPassword";
import OfflineBanner from "./components/OfflineBanner";
import EmailVerified from "./components/EmailVerified";
import { ResetPassword } from "./components/ResetPassword";

function App() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(() =>
    Boolean(localStorage.getItem("token") || sessionStorage.getItem("token")),
  );

  useEffect(() => {
    const handleAuthChange = (event) => {
      const loggedIn = Boolean(event.detail);
      setIsLoggedIn(loggedIn);

      if (!loggedIn) {
        navigate("/", { replace: true });
      }
    };

    window.addEventListener("auth-change", handleAuthChange);

    return () => window.removeEventListener("auth-change", handleAuthChange);
  }, [navigate]);

  return (
    <>
      <PageLoader />
      <OfflineBanner />

      <Routes>
        <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />

        <Route
          path="/signup"
          element={<SignUp setIsLoggedIn={setIsLoggedIn} />}
        />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/email-verified" element={<EmailVerified />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/myhabits"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <HabitsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/calender"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <CalendarPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/statistics"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <StatisticsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
