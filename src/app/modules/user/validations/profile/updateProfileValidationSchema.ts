import { Request } from 'express';
import User from '../../entities/User';
import Joi, { ObjectSchema } from 'joi';
import JoiExtensions from '@modules/core/extensions/JoiExtensions';
import { getUserFromRequestToken } from '@modules/auth/middlewares/auth';

function validate(req: Request): ObjectSchema {
	return Joi.object({
		firstName: Joi.string().min(3).max(30).required(),
		lastName: Joi.string().min(3).max(30).required(),
		address: Joi.string().min(3).max(30).required(),
		email: Joi.string()
			.email()
			.required()
			.external(async function (value) {
				let { id } = await getUserFromRequestToken(req);
				return User.findOne({ email: value }).then((user) => {
					if (user && id !== user._id.toString()) {
						JoiExtensions.throwMessage('email already exists', value, 'email', 'email');
					}
				});
			}),
		mobile: Joi.string()
			.required()
			.external(async function (value) {
				let { id } = await getUserFromRequestToken(req);
				return User.findOne({ mobile: value })
					.populate('company')
					.then((user) => {
						if (user && id !== user?._id?.toString()) {
							JoiExtensions.throwMessage('mobile already exists', value, 'mobile', 'mobile');
						}
					});
			}),
		username: Joi.string()
			.required()
			.external(async function isUniqueUsername(value: string) {
				let { id } = await getUserFromRequestToken(req);
				return User.findOne({ username: value }).then((user) => {
					if (user && id !== user?._id?.toString()) {
						JoiExtensions.throwMessage('username already exists', value, 'username', 'username');
					}
					return value;
				});
			}),
		note: Joi.string().required(),
		password: Joi.string().optional(),
	});
}
export { validate as updateProfileValidationSchema };
