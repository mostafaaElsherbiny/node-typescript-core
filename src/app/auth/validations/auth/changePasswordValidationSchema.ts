import Joi from 'joi';

const schema = Joi.object({
	newPassword: Joi.string().required(),
});

export { schema as changePasswordValidationSchema };
