import { CustomError } from "./custom-errors";

export class NotFoundError extends CustomError {
    statusCode = 404;
    message = "Not Found";

    constructor(message?: string) {
        super('Route Not Found');
        if(message) {
            this.message = message;
        }
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    serializeErrors() {
        return [{message: this.message }]
    }
}