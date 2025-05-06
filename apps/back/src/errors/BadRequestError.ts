import ERROR_CODES from "@/errors/ERROR_CODES.js";
import HttpError from "@/errors/HttpError.js";

export default class BadRequestError extends HttpError {
    constructor(message = "Bad Request", code = ERROR_CODES.BAD_REQUEST) {
        super(400, message, code);
    }
}
