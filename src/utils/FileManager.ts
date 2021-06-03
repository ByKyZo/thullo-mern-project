import { promisify } from 'util';
import { pipeline } from 'stream';
import path from 'path';
import fs from 'fs';

export default class FileManager {
    public static async uploadPicture(label: string, directory: string, file: any) {
        if (
            file.detectedMimeType !== 'image/jpg' &&
            file.detectedMimeType !== 'image/png' &&
            file.detectedMimeType !== 'image/jpeg'
        )
            throw Error('INVALID_TYPE : File must be of type png / jpg / jpeg');

        if (file.size > 500000) throw Error('MAX_SIZE : File must be max 0.5 Ko');

        const pipelinee = promisify(pipeline);

        const cleanLabel: string = label.replace(' ', '');

        const pictureName = `${cleanLabel}${Math.floor(Math.random() * 1000)}${Date.now()}.png`;
        const uploadFilePath = path.join(
            __dirname,
            '..',
            'assets',
            'images',
            directory,
            pictureName
        );
        await pipelinee(file.stream, fs.createWriteStream(uploadFilePath));

        return pictureName;
    }

    public static async uploadFile(label: string, file: any) {
        // if (file.size > 500000) throw Error('MAX_SIZE : File must be max 0.5 Ko');

        const pipelinee = promisify(pipeline);

        const cleanLabel: string = label.replace(' ', '');

        const fileName = `${cleanLabel}${Math.floor(Math.random() * 1000)}${Date.now()}-${
            file.originalName
        }`;

        const uploadFilePath = path.join(__dirname, '..', 'assets', 'attachments', fileName);
        await pipelinee(file.stream, fs.createWriteStream(uploadFilePath));

        return fileName;
    }

    private deletePicture() {}
}
