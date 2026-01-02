import { StatusCodes } from "http-status-codes";
import CustomApiError from "./CustomApiError.js";

export default class BadRequestError extends CustomApiError {
  constructor(message) {
    super(message, StatusCodes.BAD_REQUEST);
  }
}
