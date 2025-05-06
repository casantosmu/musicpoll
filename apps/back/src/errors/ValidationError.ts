import type { ErrorObject } from "ajv";
import ERROR_CODES from "@/errors/ERROR_CODES.js";
import HttpError from "@/errors/HttpError.js";

export default class ValidationError extends HttpError {
    errors: ErrorObject[];

    constructor(errors: ErrorObject[] | undefined | null) {
        super(400, "Validation Error", ERROR_CODES.VALIDATION_ERROR);

        if (!errors) {
            throw new Error("'errors' must be non nullable");
        }
        this.errors = errors;
    }
}
