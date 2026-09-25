import { StatusCodes } from "http-status-codes";
import CustomApiError from "./CutomeAPIError.js";

export default class UnauthorizedError extends CustomApiError {
    constructor(message: string) {
        super(message, StatusCodes.UNAUTHORIZED);
    }
}