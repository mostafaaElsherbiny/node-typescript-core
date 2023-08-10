import { Request, Response } from 'express';
import AuthService from '../services/AuthService';
import { getUserFromRequestToken } from '../middlewares/auth';
import ApiResponse from '@modules/core/helpers/ApiResponse';
import userTransform from '@modules/user/transform/userTransform';
class AuthController {
	login = async (req: Request, res: Response) => {
		try {
			let { user, token } = await AuthService.login(req.body);
			
			return ApiResponse.success(res, {
				user: userTransform(user),
				token: token,
			});
		} catch (err: any) {
			return ApiResponse.error(res, err.message);
		}
	};
	changePassword = async (req: Request, res: Response) => {
		try {
			let getUserFromToken = await getUserFromRequestToken(req);
			let updated = await AuthService.changePassword({
				userId: getUserFromToken?.id as string,
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
