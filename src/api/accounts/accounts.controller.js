import logger from "../../utils/logger.js";
import service from "./accounst.service.js";

const createAccount = async (req, res) => {
	try {
		const account = await service.createAccount(req.body);
		return res.json(account);
	} catch (error) {
		logger.error(error);
	}
};

const getAccount = async (req, res) => {
	const accounts = await service.getAccount();
	return res.json(accounts);
};

export default { createAccount, getAccount };
