import { ClientSession, FilterQuery, Model } from 'mongoose';
export default async function findOrCreateModel<modelType, returnType>(
	model: Model<modelType>,
	findBy: FilterQuery<any>,
	createBy: any,
	session?: ClientSession
): Promise<{ modelData: returnType; wasExist: boolean }> {
	let wasExist = true;
	let modelData = await model.findOne(findBy).session(session);
	if (!modelData) {
		[modelData] = await model.create([createBy], { session });
		wasExist = false;
	}
	return { modelData: modelData as returnType, wasExist };
}
