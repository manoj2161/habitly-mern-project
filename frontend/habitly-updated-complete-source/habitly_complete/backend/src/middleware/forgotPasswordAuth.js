import jwt from "jsonwebtoken";
import "dotenv/config";

export const emailToken = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Invalid or expired reset token",
      isSuccess: false,
      errorCode: 401,
    });
  }

  const token = authorization.split(" ")[1];

  try {
    const verification = jwt.verify(token, process.env.JWT_EMAIL_SECRET);
    req.userId = verification.id;
    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired reset token",
      isSuccess: false,
      errorCode: 401,
    });
  }
};
