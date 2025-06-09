export abstract class CustomError extends Error {
    abstract statusCode: number;
    private success: boolean = false;
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, CustomError.prototype)
    }

    abstract serializeErrors(): {message: string, field?: string}[]
}
