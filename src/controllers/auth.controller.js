import { StatusCodes } from "http-status-codes";
import { authService } from "../services/index.js";
import catchAsync from "../utils/catchAsync.js";

const register = catchAsync(async (req, res) => {
    const { user, token } = await authService.registerUser(req.body);
    
    res.cookie("token", token, {
      httpOnly: true,
    });
    
    res.status(StatusCodes.CREATED).json({
      success: true,
      user,
      token, // Send token in response for localStorage
    });
});

const login = catchAsync(async (req, res) => {
    const { user, token } = await authService.loginUser(req.body);
    
    res.cookie("token", token, {
      httpOnly: true,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      user,
      token, // Send token in response for localStorage
    });
});

const logout = catchAsync(async (req, res) => {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0), 
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Logged out successfully",
    });
});

export { login, register, logout };