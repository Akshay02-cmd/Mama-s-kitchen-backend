import { StatusCodes } from "http-status-codes";
import CustomApiError from "./CutomeAPIError.js";

export default class BadRequestError extends CustomApiError {
  constructor(message: string) {
    super(message, StatusCodes.BAD_REQUEST);
  }
}
