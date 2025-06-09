class SuccessResponse {
    private statusCode?: number = 200;
    private success?: boolean = true;
    private message: string = "";
    private data?: any;

    constructor({statusCode = 200, message, data} : {statusCode?: number, message: string, data?: any}) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
    }

}

export { SuccessResponse };