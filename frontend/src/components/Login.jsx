import girlImage from "../assets/girlImage.png";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeClosed } from "lucide-react";
import { useState } from "react";

export const Login = ({ isLoggedIn, setIsLoggedIn }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
    isLoggedIn,
  });

  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);

  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  }

  function handleSignin(e) {
    e.preventDefault();

    const newErrors = {};
    const data = JSON.parse(localStorage.getItem("users")) || [];

    const existingUser = data.find(
      (user) => user.email === formData.email.trim().toLowerCase(),
    );

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!existingUser) {
      newErrors.email = "User does not exist";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (existingUser && existingUser.password !== formData.password) {
      newErrors.password = "Password is incorrect";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (formData.rememberMe) {
      localStorage.setItem("currentUser", JSON.stringify(existingUser.id));
      sessionStorage.removeItem("currentUser");
    } else {
      sessionStorage.setItem("currentUser", JSON.stringify(existingUser.id));
      localStorage.removeItem("currentUser");
    }

    setIsLoggedIn(true);
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#fef9f3] dark:bg-gray-950 text-gray-900 dark:text-white flex flex-col lg:flex-row items-center justify-center px-4 py-8 sm:px-8 lg:px-12 transition-colors">
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center text-center">
        <img
          src={girlImage}
          alt="Self love"
          className="w-56 sm:w-72 md:w-96 lg:w-[34rem] xl:w-[40rem] max-w-full"
        />

        <div className="mt-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-bold leading-tight">
            Say hi to your
            <br />
            self-love journal
          </h1>

          <p className="font-semibold text-xs sm:text-sm md:text-base lg:text-lg mt-2 text-gray-700 dark:text-gray-300">
            Hope you have a good day
          </p>
        </div>
      </div>

      <div className="w-full max-w-xl lg:w-1/2 lg:max-w-none mt-8 lg:mt-0 lg:px-10 xl:px-20">
        <div className="text-center lg:text-left px-2 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold">Welcome back</h2>

          <p className="text-[#c64d26] mt-2">Glad to see you again</p>
        </div>

        <form
          onSubmit={handleSignin}
          className="flex flex-col gap-5 px-2 sm:px-6 mt-5"
        >
          <div>
            <label
              htmlFor="login-email"
              className="block text-sm sm:text-base font-semibold mb-2"
            >
              Email
              <span className="text-red-500 ml-1">*</span>
            </label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FDC8A0] z-10 size-5" />

              <input
                type="email"
                name="email"
                id="login-email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="rounded-md border-2 border-[#FDC8A0] focus:outline-none focus:border-[#c64d26] bg-transparent dark:bg-gray-900 w-full h-11 pl-10 pr-3"
              />
            </div>

            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="block text-sm sm:text-base font-semibold mb-2"
            >
              Password
              <span className="text-red-500 ml-1">*</span>
            </label>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FDC8A0] z-10 size-5" />

              {show ? (
                <EyeClosed
                  onClick={() => setShow(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FDC8A0] z-10 cursor-pointer size-5"
                />
              ) : (
                <Eye
                  onClick={() => setShow(true)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FDC8A0] z-10 cursor-pointer size-5"
                />
              )}

              <input
                type={show ? "text" : "password"}
                name="password"
                id="login-password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="rounded-md border-2 border-[#FDC8A0] focus:outline-none focus:border-[#c64d26] bg-transparent dark:bg-gray-900 w-full h-11 pl-10 pr-10"
              />
            </div>

            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mt-1 text-sm sm:text-base">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    rememberMe: e.target.checked,
                  }))
                }
                className="accent-orange-300"
              />

              <span className="font-semibold">Remember me</span>
            </label>

            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-[#c64d26] font-semibold text-left sm:text-right"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="bg-[#c64d26] hover:bg-[#ad401e] rounded-md h-11 text-white text-base sm:text-lg font-semibold transition"
          >
            Sign In
          </button>
        </form>

        <div className="text-center flex justify-center gap-2 mt-5 text-sm sm:text-base">
          <span>Don't have an account?</span>

          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="text-green-800 dark:text-green-400 font-semibold"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};
