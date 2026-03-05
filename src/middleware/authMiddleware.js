import jwt from "jsonwebtoken";
import User from "../models/User.js";

// 1. Extract token from Authorization header
// 2. Verify token
// 3. Find user
// 4. Attach user to req.user
// 5. Call next()
// 6. If invalid → return 401

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Extract token
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Find user
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 4. Attach user
    req.user = user;

    // 5. Continue
    next();

  } catch (error) {
    // 6. If invalid
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default authMiddleware;