import HttpError from "@/errors/HttpError.js";

export default class InternalServerError extends HttpError {
    constructor(message = "Internal Server Error") {
        super(500, message);
    }
}
