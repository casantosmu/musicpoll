import ERROR_CODES from "@/errors/ERROR_CODES.js";
import HttpError from "@/errors/HttpError.js";

export default class UnauthorizedError extends HttpError {
    constructor(message = "Unauthorized", code = ERROR_CODES.UNAUTHORIZED) {
        super(401, message, code);
    }
}
