import ErrorHandler from "../helpers/ErrorHandler.js";
import logger from "../utils/logger.js";

const errorMiddleware = (err, req, res, next) => {
	logger.error(err);

	if (err instanceof ErrorHandler) {
		return res.json({
			errorStatus: err.statusCode,
			message: err.message,
		});
	}

	return res.status(500).json({
		statusCode: 500,
		message: "Internal Server Error",
	});
};

export default errorMiddleware;
