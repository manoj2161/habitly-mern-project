import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Eye, EyeClosed, ArrowLeft } from "lucide-react";

export const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleEmailSubmit(e) {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const existingUser = users.find(
      (user) => user.email === email.trim().toLowerCase(),
    );

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!existingUser) {
      setError("No account found with this email");
      return;
    }

    setError("");
    setStep(2);
  }

  function handlePasswordSubmit(e) {
    e.preventDefault();

    if (!newPassword.trim()) {
      setError("New password is required");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
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

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const updatedUsers = users.map((user) =>
      user.email === email.trim().toLowerCase()
        ? { ...user, password: newPassword }
        : user,
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));

    setError("");
    setSuccess("Password reset successfully");

    setTimeout(() => {
      navigate("/");
    }, 1000);
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
              className="h-11 rounded-md bg-[#c64d26] font-semibold text-white transition hover:bg-[#ad401e]"
            >
              Continue
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
              <p className="text-sm text-green-600 dark:text-green-400">
                {success}
              </p>
            )}

            <button
              type="submit"
              className="h-11 rounded-md bg-[#c64d26] font-semibold text-white transition hover:bg-[#ad401e]"
            >
              Reset Password
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
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
