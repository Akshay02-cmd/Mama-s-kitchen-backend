import { StatusCodes } from "http-status-codes";
import CustomApiError from "./CustomApiError.js";

export default class UnauthorizedError extends CustomApiError {
    constructor(message) {
        super(message, StatusCodes.UNAUTHORIZED);
    }
}