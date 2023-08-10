import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import Token from '@modules/user/entities/Token';
import { IUserTransformInterface } from '@modules/user/transform/userTransform';
const config = process.env;

export const getUserFromRequestToken = async (req: Request): Promise<IUserTransformInterface> => {
	const token = req.headers['authorization']?.split(' ')[1] ?? '';
	if (!token) throw new Error('A token is required for authentication');
	let checkTokenExistInDb = await Token.exists({ token: token });
	if (!checkTokenExistInDb) throw new Error('Invalid Token');
	return jwt.verify(token, config.TOKEN_KEY as string) as IUserTransformInterface;
};

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await getUserFromRequestToken(req);
	} catch (err: any) {
		return res.status(401).send({ message: err.message });
	}
	return next();
};

export default verifyToken;
