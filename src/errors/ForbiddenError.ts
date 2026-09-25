import { StatusCodes } from "http-status-codes";
import CustomApiError from "./CutomeAPIError.js";

export default class ForbiddenError extends CustomApiError {
  constructor(message: string) {
    super(message, StatusCodes.FORBIDDEN);
  }
}
