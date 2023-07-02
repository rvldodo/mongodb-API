import Accounts from "../../db/model/account.model.js";

const createAccount = async (data) => {
	const account = new Accounts(data);
	await account.save();
	return account;
};

const getAccount = async (
	query = {},
	pagination,
	projection = {},
	sort = {}
) => {
	return await Accounts.findSafe(query, pagination, projection, sort);
};

export default { createAccount, getAccount };
