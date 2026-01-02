import { StatusCodes } from "http-status-codes";

const login = async (req, res) => {
  res.status(StatusCodes.OK).json({ message: "Login successful" });
}

const register = async (req, res) => {
  res.status(StatusCodes.CREATED).json({ message: "Registration successful" });
}

export { login, register };