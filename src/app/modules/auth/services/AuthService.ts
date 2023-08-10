import bcrypt from 'bcrypt';
import UserRole from '@modules/user/enums/UserRoleEnum';
import Token from '@modules/user/entities/Token';
import generateToken from '../helpers/generate-token';
import UserRepository from '@modules/user/repositories/UserRepository';
import userTransform from '@modules/user/transform/userTransform';
class AuthService {
	async login(data: { username: string; password: string }) {
		return await this.superAdminValidate(data);
	}
	async changePassword(data: { userId: string; newPassword: string }) {
		return UserRepository.changePassword(data);
	}

	async superAdminValidate(data: { username: string; password: string }) {
		const user = await UserRepository.findOrFail({
			$and: [{ username: data.username }, { roles: { $in: [UserRole.SuperAdmin] } }],
		});

		if (await bcrypt.compare(data.password, user.password)) {
			let token = generateToken(user);

			await Token.create({ token, user: user._id });

			return { user: userTransform(user), token };
		}
		throw new Error('Invalid Credentials');
	}
	async resetPassword(userId: string): Promise<{ newPassword: string }> {
		const newPassword = await UserRepository.resetPassword(userId);
		return { newPassword };
	}
}
export default new AuthService();
