import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyAccessToken = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token)
    return res.status(400).json({ status: false, msg: "Token not found" });
  let user;

  try {
    user = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ status: false, msg: "Invalid token" });
  }

  try {
    user = await User.findById(user.id);
    if (!user) {
      return res.status(401).json({ status: false, msg: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

export const verifyAccessType = async (req, res, next) => {
  try {
    const accessType = req.user.accessType;
    if (accessType === "admin" || accessType === "employee") {
      req["accessType"] = accessType;
    } else {
      return res
        .status(401)
        .json({ status: false, msg: "User with wrong access" });
    }
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};
