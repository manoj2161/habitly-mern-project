import jwt from "jsonwebtoken";
import "dotenv/config";
export const authToken = (req, res, next) => {
  const Auth = req.headers.authorization;
  if (!Auth) {
    return res.status(401).json({
      message: "Invalid or expired token",
      isSuccess: false,
      errorCode: 401,
    });
  }
  try {
    const token = Auth.split(" ")[1];
    const verification = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verification;
  } catch (error) {
    console.error(error.message);
    return res.status(401).json({
      message: "Invalid or expired token",
      isSuccess: false,
      errorCode: 401,
    });
  }
  next();
};
