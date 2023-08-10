import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

const validateRequest = (schema: Joi.ObjectSchema) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const { error } = schema.validate(req.body, { abortEarly: false });
		if (error) {
			const validationErrors = error.details.map((detail) => detail.message);
			return res.status(400).json({ errors: validationErrors });
		}
		next();
	};
};

export default validateRequest;
