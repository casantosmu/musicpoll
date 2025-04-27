import type { ErrorObject } from "ajv";

export default class ValidationError extends Error {
    errors: ErrorObject[];

    constructor(errors: ErrorObject[] | undefined | null) {
        super("Validation Error");

        if (!errors) {
            throw new Error("'errors' must be non nullable");
        }
        this.errors = errors;
    }
}
