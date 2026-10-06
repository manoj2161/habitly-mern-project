import { User } from "../models/userModel.js";
export const registerUser = (req, res) => {
  const { name, email, password } = req.body;
  const nameRegex = /^[A-Za-z '-]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,64}$/;
  if (
    name === "" ||
    email === "" ||
    password === "" ||
    !name ||
    !email ||
    !password
  ) {
    return res.status(400).json({
      isSuccess: false,
      errorMessage: "Invalid data entry",
      errorCode: 400,
    });
  }

  if (name.trim() === "") {
    return res.status(400).json({
      message: "Name should not be empty",
      isSuccess: false,
      errorCode: 400,
    });
  } else if (name.length < 3) {
    return res.status(400).json({
      message: "Name should be atleast 3 characters",
      isSuccess: false,
      errorCode: 400,
    });
  } else if (name.length > 50) {
    return res.status(400).json({
      message: "Name should not exceed 50 characteres",
      isSuccess: false,
      errorCode: 400,
    });
  } else if (!nameRegex.test(name)) {
    return res.status(400).json({
      message: "Invalid name",
      isSuccess: false,
      errorCode: 400,
    });
  }
  if (email.trim() === "") {
    return res.status(400).json({
      message: "Email should not be empty",
      isSuccess: false,
      errorCode: 400,
    });
  } else if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid email format",
      isSuccess: false,
      errorCode: 400,
    });
  }
  if (password.trim() === "") {
    return res.status(400).json({
      message: "Password should not be empty",
      isSuccess: false,
      errorCode: 400,
    });
  } else if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must contain uppercase, lowercase, number, special character, and be 8-64 characters long",
      isSuccess: false,
      errorCode: 400,
    });
  }
};
