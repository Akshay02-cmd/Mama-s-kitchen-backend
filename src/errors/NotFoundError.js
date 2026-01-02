import statusCode from 'http-status-codes';
import customApiError from './CustomeApi.errors.js';

export default class NotFound extends customApiError {
    constructor(message) {
        super(message, statusCode.NOT_FOUND);
    }
}