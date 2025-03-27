export default abstract class HttpError extends Error {
    readonly status: number;

    protected constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}
