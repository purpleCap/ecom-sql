import { ValidationError } from "express-validator";
import { CustomError } from "./custom-errors";

export class DatabaseConnectionError extends CustomError {
    reason = 'Error connecting to database';
    statusCode = 500;
    constructor() {
        super("Error connecting to DB");
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
    }


    serializeErrors() {
        return [
            {message: this.reason}
        ];
    }
}