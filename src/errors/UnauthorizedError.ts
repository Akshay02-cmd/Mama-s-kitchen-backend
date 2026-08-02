import { StatusCodes } from "http-status-codes";
import CustomApiError from "./CutomeAPIError.js";

export default class UnauthorizedError extends CustomApiError {
    constructor(message) {
        super(message, StatusCodes.UNAUTHORIZED);
    }
}