import ERROR_CODES from "@/errors/ERROR_CODES.js";
import HttpError from "@/errors/HttpError.js";

export default class NotFoundError extends HttpError {
    constructor(message = "Not Found", code = ERROR_CODES.NOT_FOUND) {
        super(404, message, code);
    }
}
