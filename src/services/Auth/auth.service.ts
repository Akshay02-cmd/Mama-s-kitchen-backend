import { User } from "../../repository/index.js";
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} from "../../errors/index.js";

export const registerUser = async (userData) => {
  if (userData.role) {
    throw new BadRequestError("Role is assigned by the system");
  }

  const existingUser = await User.checkExistUser(userData.email);
  if (existingUser) {
    throw new BadRequestError("User with this email already exists");
  }

  const user_ = await User.createUser({
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: "CUSTOMER",
  });

  if (!user_) {
    throw new BadRequestError("Unable to create user");
  }

  // Generate JWT token
  const token = user_.createJWT();

  return {
    user: {
      id: user_._id,
      name: user_.name,
      email: user_.email,
      role: user_.role,
    },
    token,
  };
};

export const loginUser = async (credentials) => {
  const { email, password } = credentials;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user_ = await User.UserByEmail(email);
  if (!user_) {
    throw new UnauthorizedError("Invalid credentials [Email] ");
  }

  const isPasswordCorrect = await user_.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthorizedError("Invalid credentials [Password]");
  }

  const token = user_.createJWT();

  return {
    user: {
      id: user_._id,
      name: user_.name,
      email: user_.email,
      role: user_.role,
    },
    token,
  };
};

export const getUserById = async (userId) => {
  const user_ = await User.UserById(userId);
  if (!user_) {
    throw new NotFoundError("User not found");
  }
  return user_;
};

export const getUserByEmail = async (email) => {
  const user_ = await User.UserByEmail(email);
  return user_;
};

const authService = {
  registerUser,
  loginUser,
  getUserById,
  getUserByEmail,
};

export default authService;
