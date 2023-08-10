import mongoose, { Schema, Document, CallbackError } from 'mongoose';
import hashPassword from '../helpers/hashPassword';
import UserRole from '../enums/UserRoleEnum';
export interface IUser extends Document {
	firstName: string;
	lastName: string;
	username: string;
	email: string;
	mobile: string;
	password: string;
	createdAt: Date;
	roles: UserRole[];
	active: boolean;
	image: string;
}

const UserSchema: Schema<IUser> = new Schema({
	username: {
		type: String,
		required: true,
		lowercase: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	mobile: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	roles: [
		{
			type: String,
			enum: Object.values(UserRole),
			default: UserRole.USER,
		},
	],
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	image: {
		type: String,
	},
	active: {
		type: Boolean,
		default: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

UserSchema.pre<IUser>('save', async function (next: (err?: CallbackError) => void) {
	if (!this.isModified('password')) return next();

	try {
		this.password = await hashPassword(this.password);
		next();
	} catch (error) {
		return next(error as CallbackError);
	}
});

UserSchema.pre<IUser>(['findOneAndUpdate', 'updateOne'], async function (next: (err?: CallbackError) => void) {
	let updated = this.updateOne().getUpdate() as any;

	if (updated.password === undefined) return next();
	try {
		updated.password = await hashPassword(updated.password);
		next();
	} catch (error) {
		return next(error as CallbackError);
	}
});

UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
