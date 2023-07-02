import mongoose from "mongoose";
import logger from "../utils/logger.js";

const addPaginationOptions = (options, page, pageSize) => {
	if (pageSize) {
		page = Number(page || 0);
		pageSize = Number(pageSize);
		options.skip = pageSize * page;
		options.limit = pageSize;
	}
	return options;
};

const getQueryOptions = (pagination = {}, sort = {}) => {
	const { page, pageSize, sort: sortFromPagination } = pagination;
	const options = { sort: sortFromPagination || sort };

	return addPaginationOptions(options, page, pageSize);
};

const connect = async () => {
	logger.info(`Connecting to DB: ${process.env.MONGO_HOST}`);

	mongoose.connect(process.env.MONGO_HOST, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
};

const init = async () => {
	await connect();
};

const destroy = async () => {
	await mongoose.connection.close();
	logger.info(`DB closed`);
};

const createSchema = (childSchema) => {
	const schema = new mongoose.Schema({
		...childSchema,
		created: { type: Date, default: Date.now },
		updated: { type: Date, default: Date.now },
		deleted: { type: Boolean, default: false },
		isTest: Boolean,
	});

	schema.statics.findSafe = function (
		query = {},
		pagination,
		projection = {},
		sort = {}
	) {
		const options = getQueryOptions(pagination, sort);
		const safeQuery = { ...query, deleted: false };

		if (schema.statics.populateAction) {
			return this.find(safeQuery, projection, options).populate(
				schema.statics.populateAction
			);
		}

		return this.find(safeQuery, projection, options);
	};

	schema.statics.countSafe = function (query = {}) {
		return this.countDocuments({ ...query, deleted: false });
	};

	schema.statics.findSafeAndActive = function (
		query,
		projection = {},
		sort = {}
	) {
		return this.findSafe(
			{ ...query, deleted: false, active: true },
			projection,
			sort
		);
	};

	schema.statics.findOneSafe = function (query, sort = {}) {
		const options = { sort };
		if (schema.statics.populateAction) {
			return this.findOne({ ...query, deleted: false }, {}, options).populate(
				schema.statics.populateAction
			);
		}
		return this.findOne({ ...query, deleted: false }, {}, options);
	};

	schema.statics.findLastSafe = function (query = {}) {
		return this.findOneSafe({ ...query }, { _id: -1 });
	};

	schema.statics.findByUserAndAccount = function (user, account) {
		return this.findSafe({
			user_id: user._id.toString(),
			account_id: account._id.toString(),
		});
	};
	schema.statics.findOneByUserAndAccount = function (user, account) {
		return this.findOneSafe({
			user_id: user._id.toString(),
			account_id: account._id.toString(),
		});
	};

	schema.statics.findByOid = function (id) {
		try {
			return this.findOneSafe({ _id: mongoose.Types.ObjectId(id) });
		} catch (_) {
			return null;
		}
	};

	schema.statics.findByName = function (name) {
		return this.findOneSafe({ name });
	};

	schema.statics.hardDeleteManyByUser = async function (deletedUsersIds) {
		return await this.deleteMany({ user_id: { $in: deletedUsersIds } });
	};

	schema.statics.isAllUserModelDataBeenDeleted = async function (user_id) {
		const res = await this.find({ user_id });
		return !(res && res.length > 0);
	};

	schema.statics.softDelete = async function (id) {
		return await this.updateOne({ _id: id }, { deleted: true });
	};

	schema.statics.softDeleteIfNotActive = async function (id) {
		const { nModified } = await this.updateOne(
			{ _id: id, active: false },
			{ deleted: true }
		);
		return nModified > 0;
	};

	schema.methods.sync = async function sync(data) {
		uploadHelper.uploadImageFilesFromData(data);

		this.overwrite({ ...this._doc, ...data, updated: Date.now() });
		return await this.save();
	};

	schema.methods.syncWithUpdate = async function sync(data) {
		uploadHelper.uploadImageFilesFromData(data);

		this.overwrite({ ...this._doc, ...data, updated: Date.now() });

		return await this.updateOne(
			{
				...this._doc,
			},
			{ _id: this._id }
		);
	};

	schema.methods.setFromObject = function (fromObject) {
		Object.keys(fromObject).forEach((key) => (this[key] = fromObject[key]));
	};

	return schema;
};

export default { init, destroy, createSchema };
