import mongoose from 'mongoose';

const connectToDB = async (): Promise<typeof mongoose> => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log('Database connected');
		return mongoose;
	} catch (error) {
		console.error('Error connecting to database:', error);
		throw error;
	}
};

export default connectToDB;
