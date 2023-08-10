import Joi from 'joi';

class JoiExtensions {
	isExist(model: any, column: string, requiredToExist: boolean = false, columnString?: string | null) {
		let validateExist = async (value: string) => {
			const exist = await model.exists({ [column]: value });
			if (exist && !requiredToExist) {
				this.throwMessage(`${column} already exists`, value, column, columnString ? columnString : column);
			}
			if (!exist && requiredToExist) {
				this.throwMessage(`${columnString ? columnString : column} value not exist  exists`, value, column, columnString ? columnString : column);
			}
			return value;
		};
		return validateExist;
	}

	throwMessage(message: string, value: string, key: string, label: string) {
		throw new Joi.ValidationError(
			message,
			[
				{
					message: message,
					path: [key],
					type: 'string.' + key,
					context: { key, label, value },
				},
			],
			value
		);
	}
}

export default new JoiExtensions();
