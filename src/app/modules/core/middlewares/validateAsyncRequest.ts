import Joi, { ObjectSchema, Schema, ValidationError } from 'joi';
import { Request, Response, NextFunction } from 'express';

const validateAsyncRequest = (schema: Joi.ObjectSchema | Function, functionSchema = false) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			let data = req.body;
			if (req.file) {
				data = { ...data, file: req.file };
			}
			if (functionSchema) {
				const schemaFunc = schema as (req: Request) => Schema;
				await schemaFunc(req).validateAsync(data, { abortEarly: false });
			} else {
				const objSchema = schema as ObjectSchema<any>;
				await objSchema.validateAsync(data, { abortEarly: false });
			}
			next();
		} catch (error) {
			if (error instanceof ValidationError) {
				const validationErrors = error.details.map((detail) => detail.message);
				return res.status(400).json({ errors: validationErrors });
			}
			next(error);
		}
	};
};

export default validateAsyncRequest;
