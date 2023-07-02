class ErrorHandler extends Error {
	constructor(message, statusCode) {
		this.message = message;
		this.statusCode = statusCode;
		super(message, statusCode);
	}
}

export default ErrorHandler;
