import { Request, Response } from 'express';
import { getUserFromRequestToken } from '@modules/auth/middlewares/auth';
import ApiResponse from '@modules/core/helpers/ApiResponse';
import UserService from '../services/UserService';
import SavingUserInterface from '@utils/interfaces/SavingUserInterface';
import uploadFile from '@modules/core/helpers/uploadFIle';

class ProfileController {
	updateProfile = async (req: Request, res: Response) => {
		let preparedData: SavingUserInterface = {
			email: req.body.email,
			username: req.body.username,
			mobile: req.body.mobile,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
		};
		if (req.file) {
			preparedData.image = await uploadFile(req.file, 'users');
		}
		if (req.body.password) {
			preparedData.password = req.body.password;
		}
		let { id } = await getUserFromRequestToken(req);
		try {
			let data = await UserService.update(id, preparedData);
			return ApiResponse.success(res, data);
		} catch (error: any) {
			return ApiResponse.error(res, error);
		}
	};
	deleteAccount = async (req: Request, res: Response) => {
		let { id } = await getUserFromRequestToken(req);
		try {
			let data = await UserService.delete(id);
			return ApiResponse.success(res, data);
		} catch (error: any) {
			return ApiResponse.error(res, error);
		}
	};
	deactivateAccount = async (req: Request, res: Response) => {
		let { id } = await getUserFromRequestToken(req);
		try {
			let data = await UserService.deleteAccount(id);
			return ApiResponse.success(res, data);
		} catch (error: any) {
			return ApiResponse.error(res, error);
		}
	};
	deleteProfileImage = async (req: Request, res: Response) => {
		try {
			let { id } = await getUserFromRequestToken(req);
			let data = await UserService.deleteProfileImage(id);
			return ApiResponse.success(res, data);
		} catch (error: any) {
			return ApiResponse.error(res, error.message);
		}
	};
}

export default new ProfileController();
