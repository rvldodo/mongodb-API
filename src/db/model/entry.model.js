import mongoose, { Schema } from "mongoose";

const entrySchema = new Schema({
	account_id: {
		type: mongoose.Types.ObjectId,
		ref: "Accounts",
	},
	amount: Number,
});
