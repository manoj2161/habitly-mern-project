import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock, Eye, EyeClosed, ArrowLeft, CheckCircle } from "lucide-react";
import axios from "axios";
import { resetPassword } from "../api/endpoints";

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handlePasswordSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!token) {
      setError("Invalid or missing password reset link");
      return;
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,64}$/;

    if (!passwordRegex.test(newPassword)) {
      setError(
        "Password must be 8-64 characters and contain uppercase, lowercase, number, and special character",
      );
      return;
    }

    if (!confirmPassword.trim()) {
      setError("Please confirm your password");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await axios.put(
        resetPassword,
        { password: newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSuccess("Password reset successfully");

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1500);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to reset password. The link may be invalid or expired.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fef9f3] px-4 py-8 text-gray-900 transition-colors dark:bg-gray-950 dark:text-white">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Reset Password</h1>

          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Create a new password for your account
          </p>
        </div>

        <form
          onSubmit={handlePasswordSubmit}
          className="flex flex-col gap-5 rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900 sm:p-8"
        >
          {!token ? (
            <div className="text-center">
              <p className="text-red-500">
                Invalid or missing password reset link.
              </p>
            </div>
          ) : success ? (
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle
                  className="text-green-600 dark:text-green-400"
                  size={40}
                />
              </div>

              <h2 className="text-xl font-semibold">
                Password Reset Successfully
              </h2>

              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                You can now log in with your new password.
              </p>
            </div>
          ) : (
            <>
              <div>
                <label
                  htmlFor="new-password"
                  className="mb-2 block font-semibold"
                >
                  New Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[#FDC8A0]" />

                  <input
                    type={showPassword ? "text" : "password"}
                    id="new-password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    className="h-11 w-full rounded-md border-2 border-[#FDC8A0] bg-transparent pl-10 pr-10 focus:border-[#c64d26] focus:outline-none dark:bg-gray-800"
                  />

                  {showPassword ? (
                    <EyeClosed
                      onClick={() => setShowPassword(false)}
                      className="absolute right-3 top-1/2 size-5 -translate-y-1/2 cursor-pointer text-[#FDC8A0]"
                    />
                  ) : (
                    <Eye
                      onClick={() => setShowPassword(true)}
                      className="absolute right-3 top-1/2 size-5 -translate-y-1/2 cursor-pointer text-[#FDC8A0]"
                    />
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="mb-2 block font-semibold"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[#FDC8A0]" />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    className="h-11 w-full rounded-md border-2 border-[#FDC8A0] bg-transparent pl-10 pr-10 focus:border-[#c64d26] focus:outline-none dark:bg-gray-800"
                  />

                  {showConfirmPassword ? (
                    <EyeClosed
                      onClick={() => setShowConfirmPassword(false)}
                      className="absolute right-3 top-1/2 size-5 -translate-y-1/2 cursor-pointer text-[#FDC8A0]"
                    />
                  ) : (
                    <Eye
                      onClick={() => setShowConfirmPassword(true)}
                      className="absolute right-3 top-1/2 size-5 -translate-y-1/2 cursor-pointer text-[#FDC8A0]"
                    />
                  )}
                </div>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="h-11 rounded-md bg-[#c64d26] font-semibold text-white transition hover:bg-[#ad401e] disabled:opacity-60"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 font-semibold text-[#c64d26]"
          >
            <ArrowLeft className="size-4" />
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};
