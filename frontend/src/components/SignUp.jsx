import girlImage from "../assets/girlImage.png";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, EyeClosed, UserRound, Eye } from "lucide-react";
import { useState } from "react";

export const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);
  const [cshow, setCShow] = useState(false);

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

  function handleSignup(e) {
    e.preventDefault();

    const newErrors = {};
    const userData = JSON.parse(localStorage.getItem("users")) || [];

    const existingUser = userData.find(
      (user) => user.email.toLowerCase() === formData.email.toLowerCase(),
    );

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    } else if (existingUser) {
      newErrors.email = "User already exists";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must contain at least 6 characters";
    }

    if (!formData.cpassword.trim()) {
      newErrors.cpassword = "Confirm Password is required";
    } else if (formData.cpassword.length < 6) {
      newErrors.cpassword = "Password must contain at least 6 characters";
    } else if (formData.password !== formData.cpassword) {
      newErrors.cpassword = "Password does not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newUser = {
      id: crypto.randomUUID(),
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      cpassword: formData.cpassword,
      habits: [],
    };

    userData.push(newUser);

    localStorage.setItem("users", JSON.stringify(userData));

    navigate("/");
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
            Begin your journey
            <br />
            of self-love
          </h1>

          <p className="font-semibold text-xs sm:text-sm md:text-base lg:text-lg mt-2 text-gray-700 dark:text-gray-300">
            You deserve the best version of you
          </p>
        </div>
      </div>

      <div className="w-full max-w-xl lg:w-1/2 lg:max-w-none mt-8 lg:mt-0 lg:px-10 xl:px-20">
        <div className="text-center lg:text-left px-2 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Create your account
          </h2>

          <p className="text-[#c64d26] mt-2">Let's get you started!</p>
        </div>

        <form
          onSubmit={handleSignup}
          className="flex flex-col gap-5 px-2 sm:px-6 mt-5"
        >
          <div className="relative">
            <label
              htmlFor="name"
              className="block text-sm sm:text-base font-semibold mb-2"
            >
              Full Name
              <span className="text-red-500 ml-1">*</span>
            </label>

            <div className="relative">
              <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FDC8A0] z-10 size-5" />

              <input
                type="text"
                name="name"
                id="name"
                placeholder="Enter your Full Name"
                value={formData.name}
                onChange={handleChange}
                className="rounded-md border-2 border-[#FDC8A0] focus:outline-none focus:border-[#c64d26] bg-transparent dark:bg-gray-900 w-full h-11 pl-10 pr-3"
              />
            </div>

            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div className="relative">
            <label
              htmlFor="email"
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
                id="email"
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

          <div className="relative">
            <label
              htmlFor="password"
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
                id="password"
                placeholder="Create your password"
                value={formData.password}
                onChange={handleChange}
                className="rounded-md border-2 border-[#FDC8A0] focus:outline-none focus:border-[#c64d26] bg-transparent dark:bg-gray-900 w-full h-11 pl-10 pr-10"
              />
            </div>

            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          <div className="relative">
            <label
              htmlFor="cpassword"
              className="block text-sm sm:text-base font-semibold mb-2"
            >
              Confirm Password
              <span className="text-red-500 ml-1">*</span>
            </label>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FDC8A0] z-10 size-5" />

              {cshow ? (
                <EyeClosed
                  onClick={() => setCShow(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FDC8A0] z-10 cursor-pointer size-5"
                />
              ) : (
                <Eye
                  onClick={() => setCShow(true)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FDC8A0] z-10 cursor-pointer size-5"
                />
              )}

              <input
                type={cshow ? "text" : "password"}
                name="cpassword"
                id="cpassword"
                placeholder="Confirm your password"
                value={formData.cpassword}
                onChange={handleChange}
                className="rounded-md border-2 border-[#FDC8A0] focus:outline-none focus:border-[#c64d26] bg-transparent dark:bg-gray-900 w-full h-11 pl-10 pr-10"
              />
            </div>

            {errors.cpassword && (
              <p className="text-sm text-red-500 mt-1">{errors.cpassword}</p>
            )}
          </div>

          <button
            type="submit"
            className="bg-[#c64d26] hover:bg-[#ad401e] rounded-md h-11 text-white text-base sm:text-lg font-semibold transition"
          >
            Sign Up
          </button>
        </form>

        <div className="text-center flex justify-center gap-2 mt-5 text-sm sm:text-base">
          <span>Already have an account?</span>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-green-800 dark:text-green-400 font-semibold"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
