import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import axios from "axios";
import { forgotPasswordEmail } from "../api/endpoints";

export const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
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

      setSuccess(
        response.data?.message ||
          "Password reset email sent successfully. Please check your inbox.",
      );
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to send password reset email",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fef9f3] px-4 py-8 text-gray-900 transition-colors dark:bg-gray-950 dark:text-white">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Forgot Password?</h1>

          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Enter your email and we'll send you a password reset link
          </p>
        </div>

        <form
          onSubmit={handleEmailSubmit}
          className="flex flex-col gap-5 rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900 sm:p-8"
        >
          {success ? (
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle
                  className="text-green-600 dark:text-green-400"
                  size={40}
                />
              </div>

              <h2 className="text-xl font-semibold">Check your email</h2>

              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {success}
              </p>

              <p className="mt-3 text-sm text-gray-500 dark:text-gray-500">
                The reset link will expire in 10 minutes.
              </p>
            </div>
          ) : (
            <>
              <div>
                <label
                  htmlFor="reset-email"
                  className="mb-2 block font-semibold"
                >
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
                    autoComplete="email"
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
                {loading ? "Sending..." : "Send Reset Link"}
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
