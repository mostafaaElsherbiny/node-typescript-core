import User, { IUser } from '../entities/User';
import CrudServiceInterface from '@utils/interfaces/CrudServiceInterface';
import paginate, { paginateResponse } from '@modules/core/helpers/paginate';
import FilterParametersInterface from '@utils/interfaces/FilterParametersInterface';
import userTransform, { IUserTransformInterface, userTransformCollection } from '../transform/userTransform';
import PaginationResponseInterface from '@utils/interfaces/PaginationResponseInterface';
import SavingUserInterface from '@utils/interfaces/SavingUserInterface';
import Token from '../entities/Token';
import mongoose from 'mongoose';
import UserRole from '../enums/UserRoleEnum';
import { deleteFile } from '@modules/core/helpers/uploadFIle';
import UserRepository from '../repositories/UserRepository';

class UserService implements CrudServiceInterface<IUserTransformInterface, SavingUserInterface> {
	all = async (filter: FilterParametersInterface, role: string) => {
		const users = UserRepository.getAll({
			$and: [{ roles: { $in: [role] } }],
		});

		const countQuery = UserRepository.countBy({ $and: [{ roles: { $in: [role] } }] });

		return await paginateResponse(filter, users, countQuery, userTransformCollection);
	};

	create = async (data: SavingUserInterface): Promise<IUserTransformInterface> => {
		let user = await User.create(data);
		return userTransform(user);
	};

	getById = async (id: string): Promise<IUserTransformInterface> => {
		let user = await UserRepository.findOrFail({ _id: id });

		return userTransform(user);
	};
	update = async (id: string, data: SavingUserInterface): Promise<IUserTransformInterface | null> => {
		let updatedUser = await UserRepository.update(id, data);

		return updatedUser ? userTransform(updatedUser) : null;
	};
	delete = async (id: string): Promise<boolean> => {
		return await UserRepository.delete(id);
	};
	deactivate = async (id: string) => {
		const session = await mongoose.startSession();
		session.startTransaction();
		try {
			const deactivated = await User.updateOne({ _id: id }, { active: false }, { session });
			await Token.deleteMany({ user: id }, { session });
			await session.commitTransaction();
			session.endSession();
			return deactivated.modifiedCount > 0;
		} catch (error) {
			await session.abortTransaction();
			session.endSession();
			throw error;
		}
	};
	deleteAccount = async (id: string) => {
		return await this.delete(id);
	};
	deleteProfileImage = async (id: string) => {
		let user = await User.findById(id);
		if (!user) throw new Error('User not found');
		if (!user.image) throw new Error('User does not have image');
		deleteFile(user.image);
		user.image = null;
		await user.save();
		return true;
	};
}

export default new UserService();
