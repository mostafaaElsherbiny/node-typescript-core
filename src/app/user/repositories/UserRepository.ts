import mongoose, { ClientSession, FilterQuery, Mongoose } from 'mongoose';
import User, { IUser } from '../entities/User';
import SavingUserInterface from '@modules/utils/interfaces/SavingUserInterface';
import Token from '../entities/Token';
class UserRepository {
	getAll = (criteria: FilterQuery<IUser>): Promise<IUser[]> => {
		let data = User.find(criteria);
		return data;
	};
	countBy = (criteria: FilterQuery<IUser>): Promise<number> => {
		let data = User.countDocuments(criteria);
		return data;
	};

	findOrFail = async (criteria: FilterQuery<IUser>): Promise<IUser | null> => {
		let user = await User.findOne(criteria);
		if (!user) throw new Error('not found');
		return user;
	};

	update = async (id: string, data: SavingUserInterface): Promise<IUser> => {
		let user = await this.findOrFail({ _id: id });

		user.updateOne(data);

		return user;
	};

	delete = async (id: string): Promise<boolean> => {
		const session = await mongoose.startSession();

		try {
			await session.withTransaction(async (session) => {
				let user = await this.findOrFail({ _id: id });
				await user.deleteOne();
				await Token.deleteMany({ user: id }, { session });
				return true;
			});

			session.endSession();

			return true;
		} catch (error) {
			session.endSession();
			throw error;
		}
	};

	resetPassword = async (userId: string): Promise<string> => {
		const session = await mongoose.startSession();

		try {
			const user = await this.findOrFail({ _id: userId });

			let newPassword = this.generateRandomPassword();

			await session.withTransaction(async (session) => {
				await user.updateOne({ password: newPassword }).session(session);

				await Token.deleteMany({ user: userId }).session(session);
			});

			session.endSession();

			return newPassword;
		} catch (error) {
			session.endSession();
			throw error;
		}
	};

	changePassword = async (data: { userId: string; newPassword: string }): Promise<boolean> => {
		const session = await mongoose.startSession();

		try {
			const user = await this.findOrFail({ _id: data.userId });

			await session.withTransaction(async (session) => {
				await user.updateOne({ password: data.newPassword }).session(session);
				await Token.deleteMany({ user: data.userId }).session(session);
			});

			session.endSession();

			return true;
		} catch (error) {
			session.endSession();
			throw error;
		}
	};
	private generateRandomPassword() {
		return Math.random().toString(36).slice(-8);
	}
}
export default new UserRepository();
