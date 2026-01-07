import { StatusCodes } from "http-status-codes";
import User from "../db/user.js";


const register = async (req, res) => {
  try {
    const user = await User.create({ ...req.body });
    const token = user.createJWT();
    res.cookie("token", token, {
      httpOnly: true,
    });
    res
      .status(StatusCodes.CREATED)
      .json({ user: { name: user.username }, token });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Please provide email and password" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid credentials (email)" });
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid credentials (password)" });
    }
    const token = user.createJWT();
    res.cookie("token", token, {
      httpOnly: true,
    });
    res
      .status(StatusCodes.OK)
      .json({ message: "Login successful", user: { name: user.username }, token });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export { login, register };