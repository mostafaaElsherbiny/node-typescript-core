import express from 'express';
import loadApp from './app/loadApp';
import http from 'http';

const app = express();
loadApp(app).then(() => {
	const PORT: number = parseInt(process.env.PORT as string);

	const server = http.createServer(app);

	server.listen(PORT, (): void => {
		console.log(`Server Running http://localhost:${PORT} 🚀`);
	});
});
