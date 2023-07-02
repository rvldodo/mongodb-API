import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import "../dotEnvInit.js";
import index from "./api/index.js";
import db from "./db/db.js";
import errorMiddleware from "./middleware/error.middleware.js";
import logger from "./utils/logger.js";

const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// cors
app.use(cors());

app.use("/api/v1", index);

app.use(errorMiddleware);

app.listen(PORT, async () => {
	logger.info(`Server listening on ${PORT}`);
	db.init();
	logger.info(`Connected to DB!!!`);
});
