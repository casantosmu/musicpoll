import HttpError from "@/errors/HttpError.js";

export default class UnauthorizedError extends HttpError {
    constructor(message = "Unauthorized") {
        super(401, message);
    }
}
