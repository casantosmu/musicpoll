import HttpError from "@/errors/HttpError.js";

export default class BadRequestError extends HttpError {
    constructor(message = "Bad Request") {
        super(400, message);
    }
}
