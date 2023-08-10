import jwt from 'jsonwebtoken';
import { IUser } from '@modules/user/entities/User'; // Assuming User.ts is in the same directory
import userTransform from '@modules/user/transform/userTransform';
const generateToken = (user: IUser) => {
	const token = jwt.sign(userTransform(user), process.env.TOKEN_KEY as string, {
		expiresIn: '7d',
	});
	return token;
};

export default generateToken;
