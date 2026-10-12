import express from "express";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  userDashboard,
  updateName,
  updatePassword,
  deleteUser,
  forgotPasswordStepOne,
  forgotPasswordStepTwo,
  verifyEmail,
  resendVerificationEmail,
} from "../controllers/userControllers.js";
import { authToken } from "../middleware/auth.js";
import { emailToken } from "../middleware/forgotPasswordAuth.js";
const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logoutUser);
router.get("/dashboard/profile", authToken, userDashboard);
router.put("/dashboard/profile/name", authToken, updateName);
router.put("/dashboard/profile/password", authToken, updatePassword);
router.delete("/dashboard/profile/delete", authToken, deleteUser);
router.post("/forgot-password/email", forgotPasswordStepOne);
router.put("/forgot-password/reset", emailToken, forgotPasswordStepTwo);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);
export default router;
