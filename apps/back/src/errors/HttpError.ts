export default abstract class HttpError extends Error {
    readonly status: number;
    readonly code: string;

    protected constructor(status: number, message: string, code: string) {
        super(message);
        this.status = status;
        this.code = code;
    }
}
