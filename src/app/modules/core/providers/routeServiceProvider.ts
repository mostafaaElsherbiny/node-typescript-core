import express, { Application, Request, Response } from 'express';
import { userRoutes } from '@modules/user/routes/userRoutes';
import path from 'path';
import { authRoutes } from '@modules/auth/routes/authRoutes';
import verifyToken from '@modules/auth/middlewares/auth';
const loadAppRoutes = (app: Application) => {
	const modules = [
		{
			prefix: '/user',
			paths: userRoutes,
			middlewares: [verifyToken],
		},
		{
			prefix: '/auth',
			paths: authRoutes,
			middlewares: [],
		},
	];

	modules.forEach((module) => {
		const { prefix, middlewares, paths } = module;
		if (middlewares && middlewares.length > 0) {
			app.use(prefix, middlewares, paths);
		} else {
			app.use(prefix, paths);
		}
	});

	app.get('/', (req: Request, res: Response): void => {
		res.send('Hello World!');
	});

	//load files route
	app.use('/assets', express.static(path.join('assets/uploads')));
};
export { loadAppRoutes };
