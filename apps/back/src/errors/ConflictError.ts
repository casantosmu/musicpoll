import ERROR_CODES from "@/errors/ERROR_CODES.js";
import HttpError from "@/errors/HttpError.js";

export default class ConflictError extends HttpError {
    constructor(message = "Conflict", code = ERROR_CODES.CONFLICT) {
        super(409, message, code);
    }
}
