import findOrCreateModel from '@modules/core/helpers/findOrCreateModelIn';
import User from '@modules/user/entities/User';
import UserRoleEnum from '@modules/user/enums/UserRoleEnum';
export const superAdminSeeder = async function () {
	try {
		let user = await findOrCreateModel(
			User,
			{
				username: 'admin',
				roles: [UserRoleEnum.SuperAdmin],
			},
			{
				firstName: 'super',
				lastName: 'admin',
				username: 'admin',
				password: 'admin',
				email: 'admin@admin.com',
				mobile: '010000000',
				roles: [UserRoleEnum.SuperAdmin],
			}
		);
		console.log(user);
	} catch (err) {
		console.log(err);
		
		throw err;
	}
};
