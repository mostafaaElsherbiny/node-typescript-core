import fs from 'fs';
import path from 'path';

export async function getArrayOfFilesFromDir(folderPath: string): Promise<string[]> {
	const files: string[] = fs.readdirSync(folderPath).map((file) => path.join(folderPath, file));
	return files;
}
