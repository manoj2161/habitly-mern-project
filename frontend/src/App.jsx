import { useState } from "react";
import { Route, Routes } from "react-router-dom";
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
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return Boolean(
      localStorage.getItem("currentUser") ||
      sessionStorage.getItem("currentUser"),
    );
  });

  return (
    <>
      <PageLoader />

      <Routes>
        <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />

        <Route
          path="/signup"
          element={<SignUp setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
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
