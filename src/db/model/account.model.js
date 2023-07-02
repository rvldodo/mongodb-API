import mongoose from "mongoose";
import db from "../db.js";

const accountSchema = db.createSchema({
	firstName: String,
	lastName: String,
	email: String,
	password: String,
	balance: Number,
	currency: String,
});

accountSchema.statics.findOneByFirstName = function (name) {
	return this.findOneSafe({ name });
};

const Accounts = mongoose.model("Accounts", accountSchema);

export default Accounts;
