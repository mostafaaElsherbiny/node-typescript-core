import { Response } from 'express';

class ApiResponse {
	success(res: Response, data: any, message?: string): void {
		const response = {
			success: true,
			data,
			message: message || 'Success',
		};
		res.status(200).json(response);
	}

	error(res: Response, error: any, statusCode = 500): void {
		const response = {
			success: false,
			error,
		};
		res.status(statusCode).json(response);
	}
}

export default new ApiResponse();
