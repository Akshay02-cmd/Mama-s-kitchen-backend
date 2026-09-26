import statusCode from 'http-status-codes';
import customApiError from './CutomeAPIError.js';

export default class NotFound extends customApiError {
    constructor(message: string) {
        super(message, statusCode.NOT_FOUND);
    }
}