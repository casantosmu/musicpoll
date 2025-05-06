import ERROR_CODES from "@/errors/ERROR_CODES.js";
import HttpError from "@/errors/HttpError.js";

export default class InternalServerError extends HttpError {
    constructor(message = "Internal Server Error", code = ERROR_CODES.INTERNAL_SERVER_ERROR) {
        super(500, message, code);
    }
}
