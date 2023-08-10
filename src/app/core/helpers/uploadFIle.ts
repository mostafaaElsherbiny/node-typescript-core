import path from 'path';
import fs from 'fs';
async function uploadFile(file: Express.Multer.File, folderPath: string): Promise<string> {
	const originalFileName = file.originalname;
	const tempPath = file.path;

	const newFileName = Date.now() + '_' + originalFileName;
	fs.mkdirSync('assets/uploads/' + folderPath, { recursive: true });
	const destinationPath = path.join('assets/uploads/' + folderPath, newFileName);
	return new Promise<string>((resolve, reject) => {
		fs.rename(tempPath, destinationPath, (error) => {
			if (error) {
				reject(new Error(error.message || 'Error uploading file'));
			} else {
				const newFilePath = path.join(folderPath, newFileName);
				resolve(newFilePath);
			}
		});
	});
}

export const deleteFile = async (filePath: string) => {
	const fullPath = path.join('assets/uploads/', filePath);
	fs.unlink(fullPath, (error) => {
		if (error) throw error;
	});
};
export default uploadFile;
