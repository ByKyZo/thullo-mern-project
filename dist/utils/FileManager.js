"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const stream_1 = require("stream");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class FileManager {
    static uploadPicture(label, directory, file) {
        return __awaiter(this, void 0, void 0, function* () {
            if (file.detectedMimeType !== 'image/jpg' &&
                file.detectedMimeType !== 'image/png' &&
                file.detectedMimeType !== 'image/jpeg')
                throw Error('INVALID_TYPE : File must be of type png / jpg / jpeg');
            if (file.size > 500000)
                throw Error('MAX_SIZE : File must be max 0.5 Ko');
            const pipelinee = util_1.promisify(stream_1.pipeline);
            const cleanLabel = label.replace(' ', '');
            const pictureName = `${cleanLabel}${Math.floor(Math.random() * 1000)}${Date.now()}.png`;
            const uploadFilePath = path_1.default.join(__dirname, '..', 'assets', 'images', directory, pictureName);
            yield pipelinee(file.stream, fs_1.default.createWriteStream(uploadFilePath));
            return pictureName;
        });
    }
    deletePicture() { }
}
exports.default = FileManager;
