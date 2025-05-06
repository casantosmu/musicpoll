import HttpError from "@/errors/HttpError.js";

export default class ConflictError extends HttpError {
    constructor(message = "Conflict") {
        super(409, message);
    }
}
