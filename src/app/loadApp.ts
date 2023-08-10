import * as dotenv from 'dotenv';
import { Application } from 'express';
import { loadAppMiddleware } from '@modules/core/providers/middlewareServiceProvider';
import { loadAppRoutes } from '@modules/core/providers/routeServiceProvider';
import connectToDB from '@modules/core/database/connection';

const loadApp = async (app: Application) => {
	dotenv.config();
	if (!process.env.PORT) {
		process.exit(1);
	}
	loadAppMiddleware(app);
	await connectToDB();

	loadAppRoutes(app);
};
export default loadApp;
