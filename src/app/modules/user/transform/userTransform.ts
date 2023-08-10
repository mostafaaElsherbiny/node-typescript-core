import { IUser } from '../entities/User';
export interface IUserTransformInterface {
	id: string;
	firstName: string;
	lastName: string;
	username: string;
	email: string;
	mobile: string;
	roles: string[];
	image?: string;
	createdAt: Date;
}

function userTransform(user: IUser): IUserTransformInterface {
	let base_url = process.env.base_url;
	const transformed: IUserTransformInterface = {
		id: user._id,
		firstName: user.firstName,
		lastName: user.lastName,
		username: user.username,
		email: user.email,
		mobile: user.mobile,
		roles: user.roles,
		image: user.image ? `${base_url}/assets/${user.image}` : null,
		createdAt: user.createdAt,
	};
	return transformed;
}

export function userTransformCollection(users: IUser[]): IUserTransformInterface[] {
	return users.map((user) => userTransform(user));
}

export default userTransform;
