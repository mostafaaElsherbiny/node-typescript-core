import { Request, Response } from 'express';
import AuthService from '../services/AuthService';
import { getUserFromRequestToken } from '../middlewares/auth';
import ApiResponse from '@modules/core/helpers/ApiResponse';
import userTransform from '@modules/user/transform/userTransform';
class AuthController {
	login = async (req: Request, res: Response) => {
		try {
			let result = await AuthService.login(req.body);

			return ApiResponse.success(res, result);
		} catch (err: any) {
			return ApiResponse.error(res, err.message);
		}
	};
	changePassword = async (req: Request, res: Response) => {
		try {
			let user = await getUserFromRequestToken(req);

			let updated = await AuthService.changePassword({
				userId: user?.id as string,
				newPassword: req.body.newPassword,
			});
			return ApiResponse.success(res, updated);
		} catch (err: any) {
			return ApiResponse.error(res, err);
		}
	};
	resetPassword = async (req: Request, res: Response) => {
		try {
			let { id } = await getUserFromRequestToken(req);
			let updated = await AuthService.resetPassword(id);
			return ApiResponse.success(res, updated);
		} catch (err: any) {
			return ApiResponse.error(res, err);
		}
	};
}

export default new AuthController();
