import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Eye, EyeClosed, ArrowLeft } from "lucide-react";
import axios from "axios";
import { forgotPasswordEmail, resetPassword } from "../api/endpoints";

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleEmailSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(forgotPasswordEmail, {
        email: email.trim().toLowerCase(),
      });

      const token = response.data?.token;
      if (!token) {
        setError("Unable to start password reset");
        return;
      }

      setResetToken(token);
      setStep(2);
    } catch (error) {
      setError(error.response?.data?.message || "Unable to find account");
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

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
            Authorization: `Bearer ${resetToken}`,
          },
        },
      );

      setSuccess("Password reset successfully");

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1000);
    } catch (error) {
      setError(error.response?.data?.message || "Unable to reset password");
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
            {step === 1
              ? "Enter your email to reset your password"
              : "Create a new password for your account"}
          </p>
        </div>

        {step === 1 ? (
          <form
            onSubmit={handleEmailSubmit}
            className="flex flex-col gap-5 rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900 sm:p-8"
          >
            <div>
              <label htmlFor="reset-email" className="mb-2 block font-semibold">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[#FDC8A0]" />
                <input
                  type="email"
                  id="reset-email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your email"
                  className="h-11 w-full rounded-md border-2 border-[#FDC8A0] bg-transparent pl-10 pr-3 focus:border-[#c64d26] focus:outline-none dark:bg-gray-800"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="h-11 rounded-md bg-[#c64d26] font-semibold text-white transition hover:bg-[#ad401e] disabled:opacity-60"
            >
              {loading ? "Checking..." : "Continue"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 font-semibold text-[#c64d26]"
            >
              <ArrowLeft className="size-4" />
              Back to Login
            </button>
          </form>
        ) : (
          <form
            onSubmit={handlePasswordSubmit}
            className="flex flex-col gap-5 rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900 sm:p-8"
          >
            <div>
              <label htmlFor="new-password" className="mb-2 block font-semibold">
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
              <label htmlFor="confirm-password" className="mb-2 block font-semibold">
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
            {success && (
              <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="h-11 rounded-md bg-[#c64d26] font-semibold text-white transition hover:bg-[#ad401e] disabled:opacity-60"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setResetToken("");
                setError("");
              }}
              className="flex items-center justify-center gap-2 font-semibold text-[#c64d26]"
            >
              <ArrowLeft className="size-4" />
              Change Email
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
