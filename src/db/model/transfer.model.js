import mongoose, { Schema } from "mongoose";

const transferSchema = new Schema({
	from_account_id: {
		type: mongoose.Types.ObjectId,
		ref: "Accounts",
	},
	to_account_id: {
		type: mongoose.Types.ObjectId,
		ref: "Accounts",
	},
});
