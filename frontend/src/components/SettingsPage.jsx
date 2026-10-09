import { useEffect, useState } from "react";
import {
  User,
  Palette,
  LogOut,
  Trash2,
  ShieldAlert,
  Pencil,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { AsideDashboard } from "./AsideDashboard";
import { useNavigate } from "react-router-dom";
import { DarkModeToggle } from "./DarkModeToggle";
import axios from "axios";

import { getCurrentUser } from "../utils/user";
import { getToken, clearAuth } from "../utils/auth";
import {
  updateUserName,
  changePassword,
  deleteAccount as deleteAccountEndpoint,
} from "../api/endpoints";

export const SettingsPage = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser();

        console.log("Settings user:", currentUser);

        const userData = {
          ...currentUser,
          ...(currentUser?.data || {}),
          ...(currentUser?.user || {}),
        };

        setUser(userData);
        setName(userData?.name || "");
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    }

    loadUser();

    const savedDarkMode = JSON.parse(localStorage.getItem("darkMode")) || false;

    document.documentElement.classList.toggle("dark", savedDarkMode);
  }, []);

  function showMessage(text) {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 2500);
  }

  async function handleNameChange(e) {
    e.preventDefault();

    if (!name.trim()) {
      showMessage("Name cannot be empty");
      return;
    }

    try {
      const token = getToken();

      const response = await axios.put(
        updateUserName,
        {
          name: name.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const updatedUser =
        response.data?.user || response.data?.data || response.data;

      setUser((prev) => ({
        ...prev,
        ...updatedUser,
        name: updatedUser?.name || name.trim(),
      }));

      setName(updatedUser?.name || name.trim());

      showMessage("Name updated successfully");
    } catch (error) {
      console.error("Failed to update name:", error);

      showMessage(error.response?.data?.message || "Failed to update name");
    }
  }

  async function handlePasswordChange(e) {
    e.preventDefault();

    if (!password.trim()) {
      showMessage("Password cannot be empty");
      return;
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,64}$/;

    if (!passwordRegex.test(password)) {
      showMessage(
        "Password must be 8-64 characters and contain uppercase, lowercase, number, and special character",
      );
      return;
    }

    try {
      const token = getToken();

      await axios.put(
        changePassword,
        {
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setPassword("");
      setShowPassword(false);

      showMessage("Password updated successfully");
    } catch (error) {
      console.error("Failed to update password:", error);

      showMessage(error.response?.data?.message || "Failed to update password");
    }
  }

  function handleLogout() {
    const confirmed = window.confirm("Are you sure you want to logout?");

    if (!confirmed) return;

    clearAuth();
    navigate("/", { replace: true });
  }

  async function handleDeleteAccount() {
    if (!user) return;

    const confirmed = window.confirm(
      "This will permanently delete your account and all your habits. Continue?",
    );

    if (!confirmed) return;

    try {
      const token = getToken();

      await axios.delete(deleteAccountEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      clearAuth();
      localStorage.removeItem("darkMode");

      document.documentElement.classList.remove("dark");

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Failed to delete account:", error);

      showMessage(error.response?.data?.message || "Failed to delete account");
    }
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <div className="flex min-h-screen">
        <div className="hidden w-[20%] lg:block">
          <AsideDashboard />
        </div>

        <main className="w-full px-4 py-5 pb-[100px] sm:px-6 sm:py-6 lg:w-[80%] lg:pb-6">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl dark:text-white">
                Settings
              </h1>

              <p className="mt-1 text-sm text-gray-500 sm:text-base dark:text-slate-400">
                Manage your account and application preferences.
              </p>
            </div>

            {message && (
              <div className="fixed right-4 top-4 z-[60] flex max-w-[calc(100%-2rem)] items-center gap-2 rounded-lg bg-gray-900 px-4 py-3 text-sm text-white shadow-lg sm:right-6 sm:top-6 sm:px-5 sm:text-base dark:bg-white dark:text-gray-900">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span>{message}</span>
              </div>
            )}

            <div className="space-y-5 sm:space-y-6">
              {/* PROFILE */}
              <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center gap-3 border-b border-gray-200 p-4 sm:p-5 dark:border-slate-700">
                  <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-950">
                    <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                      Profile
                    </h2>

                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      Manage your personal information
                    </p>
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row sm:gap-5">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
                      <User className="h-10 w-10 text-green-600 dark:text-green-400" />
                    </div>

                    <div className="text-center sm:text-left">
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                        {user?.name || "User"}
                      </h3>

                      <p className="mt-1 break-all text-gray-500 dark:text-slate-400">
                        {user?.email || "No email available"}
                      </p>

                      <p className="mt-1 text-sm text-gray-400 dark:text-slate-500">
                        {user?.habits?.length || 0} habits
                      </p>
                    </div>
                  </div>

                  <form
                    onSubmit={handleNameChange}
                    className="border-t border-gray-100 pt-5 dark:border-slate-800"
                  >
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                      Change Name
                    </label>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition focus:ring-2 focus:ring-green-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:ring-green-900"
                        placeholder="Enter your name"
                      />

                      <button
                        type="submit"
                        className="flex items-center justify-center gap-2 rounded-lg bg-green-500 px-5 py-2 text-white transition hover:bg-green-600"
                      >
                        <Pencil className="h-4 w-4" />
                        Update Name
                      </button>
                    </div>
                  </form>
                </div>
              </section>

              {/* APPEARANCE */}
              <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center gap-3 border-b border-gray-200 p-4 sm:p-5 dark:border-slate-700">
                  <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-950">
                    <Palette className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                      Appearance
                    </h2>

                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      Customize the appearance of your dashboard
                    </p>
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <Palette className="h-5 w-5 shrink-0 text-purple-500" />

                      <div>
                        <p className="font-medium text-gray-700 dark:text-slate-200">
                          Dark Mode
                        </p>

                        <p className="text-sm text-gray-400 dark:text-slate-500">
                          Change the dashboard appearance
                        </p>
                      </div>
                    </div>

                    <DarkModeToggle />
                  </div>
                </div>
              </section>

              {/* SECURITY */}
              <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center gap-3 border-b border-gray-200 p-4 sm:p-5 dark:border-slate-700">
                  <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-950">
                    <Lock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                      Security
                    </h2>

                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      Manage your account password
                    </p>
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  <form onSubmit={handlePasswordChange}>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
                      New Password
                    </label>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-orange-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:ring-orange-900"
                        placeholder="Enter new password"
                      />

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-600 transition hover:bg-gray-50 sm:flex-none dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>

                        <button
                          type="submit"
                          className="flex-1 rounded-lg bg-orange-500 px-5 py-2 text-white transition hover:bg-orange-600 sm:flex-none"
                        >
                          Update Password
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </section>

              {/* ACCOUNT */}
              <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center gap-3 border-b border-gray-200 p-4 sm:p-5 dark:border-slate-700">
                  <div className="rounded-lg bg-gray-100 p-2 dark:bg-slate-800">
                    <LogOut className="h-5 w-5 text-gray-600 dark:text-slate-300" />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                      Account
                    </h2>

                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      Manage your current session
                    </p>
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-800 px-5 py-2.5 text-white transition hover:bg-gray-700 sm:w-auto dark:bg-slate-700 dark:hover:bg-slate-600"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </section>

              {/* DANGER ZONE */}
              <section className="overflow-hidden rounded-xl border border-red-200 bg-red-50 dark:border-red-950 dark:bg-red-950/30">
                <div className="flex items-center gap-3 border-b border-red-200 p-4 sm:p-5 dark:border-red-950">
                  <div className="rounded-lg bg-red-100 p-2 dark:bg-red-950">
                    <ShieldAlert className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-red-700 dark:text-red-400">
                      Danger Zone
                    </h2>

                    <p className="text-sm text-red-500 dark:text-red-400/80">
                      These actions cannot be undone
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                  <div>
                    <p className="font-medium text-red-700 dark:text-red-400">
                      Delete Account
                    </p>

                    <p className="mt-1 text-sm text-red-500 dark:text-red-400/80">
                      Permanently delete your account and all your habits
                    </p>
                  </div>

                  <button
                    onClick={handleDeleteAccount}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600 sm:w-auto"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Account
                  </button>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>

      <div className="lg:hidden">
        <AsideDashboard />
      </div>
    </div>
  );
};
