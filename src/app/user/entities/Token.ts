import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface IToken extends Document {
	token: string;
	user: IUser['_id'];
	createdAt: Date;
}

const TokenSchema: Schema<IToken> = new Schema({
	token: {
		type: String,
		required: true,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Token = mongoose.model<IToken>('Token', TokenSchema);

export default Token;
