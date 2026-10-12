import jwt from "jsonwebtoken";
import "dotenv/config";

export const authToken = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Invalid or expired token",
      isSuccess: false,
      errorCode: 401,
    });
  }

  const token = authorization.split(" ")[1];

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired token",
      isSuccess: false,
      errorCode: 401,
    });
  }
};
