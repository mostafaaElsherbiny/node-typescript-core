import { Request, Response } from 'express';
import { getUserFromRequestToken } from '@modules/auth/middlewares/auth';
import ApiResponse from '@modules/core/helpers/ApiResponse';
import UserService from '../services/UserService';
import SavingUserInterface from '@utils/interfaces/SavingUserInterface';

class UserController {
	getAll = async (req: Request, res: Response) => {
		try {
			const users = await UserService.all(
				{
					page: parseInt(req.query.pageNumber as string) ?? 1,
					size: parseInt(req.query.pageSize as string) ?? 10,
				},
				req.query.role as string
			);
			return ApiResponse.success(res, users);
		} catch (e: any) {
			return ApiResponse.error(res, e.message);
		}
	};
	show = async (req: Request, res: Response) => {
		try {
			const user = await UserService.getById(req.params.id);
			return ApiResponse.success(res, user);
		} catch (e: any) {
			return ApiResponse.error(res, e.message);
		}
	};
	store = async (req: Request, res: Response) => {
		console.log(req.body);
		
		let preparedData: SavingUserInterface = {
			email: req.body.email,
			password: req.body.password,
			username: req.body.username,
			mobile: req.body.mobile,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			roles: [req.body.role],
		};
		console.log(preparedData);
		
		try {
			let data = await UserService.create(preparedData);
			return ApiResponse.success(res, data);
		} catch (error: any) {
			return ApiResponse.error(res, error);
		}
	};
	update = async (req: Request, res: Response): Promise<void> => {
		let preparedData: SavingUserInterface = {
			email: req.body.email,
			username: req.body.username,
			mobile: req.body.mobile,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
		};
		if (req.body.password) {
			preparedData.password = req.body.password;
		}
		try {
			let data = await UserService.update(req.params.id, preparedData);
			return ApiResponse.success(res, data);
		} catch (error: any) {
			return ApiResponse.error(res, error);
		}
	};
	delete = async (req: Request, res: Response): Promise<void> => {
		UserService.delete(req.params.id)
			.then(() => {
				return ApiResponse.success(res, null, 'deleted successfully');
			})
			.catch((err: any) => {
				return ApiResponse.error(res, err.message || 'Some error occurred while deleting.');
			});
	};
}

export default new UserController();
