import User from '../../entities/User';
import Joi, { ObjectSchema } from 'joi';
import UserRole from '@modules/user/enums/UserRoleEnum';
import { Request } from 'express';
import JoiExtensions from '@modules/core/extensions/JoiExtensions';
function validate(req: Request): ObjectSchema {
	const schema = Joi.object({
		username: Joi.string()
			.required()
			.external(async function isUniqueUsername(value: string, helpers: any) {
				return User.findOne({ username: value }).then((user) => {
					if (user) {
						JoiExtensions.throwMessage('username already exists', value, 'username', 'username');
					}
					return value;
				});
			}),
		firstName: Joi.string().min(3).max(30).required(),
		lastName: Joi.string().min(3).max(30).required(),
		address: Joi.string().min(3).max(30).required(),
		password: Joi.string().min(8).max(30).required(),
		email: Joi.string().email().required().external(JoiExtensions.isExist(User, 'email')),
		mobile: Joi.string().required().external(JoiExtensions.isExist(User, 'mobile')),
		note: Joi.string().required(),
		role: Joi.string().required().valid(UserRole.SuperAdmin, UserRole.USER),
	});
	return schema;
}

export { validate as userValidationSchema };
