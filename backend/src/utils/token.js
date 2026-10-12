import jwt from "jsonwebtoken";
import "dotenv/config";

export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};
export const generateEmailVerificationToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_EMAIL_VERIFICATION_SECRET, {
    expiresIn: "30m",
  });
};
