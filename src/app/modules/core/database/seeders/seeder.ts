import connectToDB from '../connection';
import { superAdminSeeder } from './superAdminSeeder';
import dotenv from 'dotenv';
async function seedDB() {
	try {
		dotenv.config();
		await connectToDB();
		await superAdminSeeder();
		console.log('seeded Successfully 🚀');
	} catch (err: any) {
		throw err;
	}
}

seedDB()
	.then(() => console.log('done'))
	.catch((error) => {
		throw error;
	});
