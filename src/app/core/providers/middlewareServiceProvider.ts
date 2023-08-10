import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import multer from 'multer';

const loadAppMiddleware = (app: Application) => {
	const storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, 'assets/');
		},
		filename: function (req, file, cb) {
			cb(null, file.fieldname + '-' + Date.now());
		},
	});

	const upload = multer({ storage, dest: 'assets/' });

	app.use(helmet());
	app.use(cors());
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	app.use(upload.array('files'));
};
export { loadAppMiddleware };
