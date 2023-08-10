import * as dotenv from 'dotenv';
import { Application } from 'express';
import { loadAppMiddleware } from './core/providers/middlewareServiceProvider';
import { loadAppRoutes } from './core/providers/routeServiceProvider';
import connectToDB from './core/database/connection';

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
