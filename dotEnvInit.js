const path = "./src/config/.env";

process.argv.forEach((val, i) => {
	val === "-env" ? (path = process.argv[i + 1].toUpperCase()) : null;
});

import dotenv from "dotenv";
dotenv.config({ path });
