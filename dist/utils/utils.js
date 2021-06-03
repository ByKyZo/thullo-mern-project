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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class Utils {
    static toObject(doc) {
        return JSON.parse(JSON.stringify(doc));
    }
    static checkToken(token) {
        const tokenDecoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_TOKEN, (err) => __awaiter(this, void 0, void 0, function* () {
            if (err)
                return console.log('INVALID_TOKEN');
            const tokenDecoded = yield jsonwebtoken_1.default.decode(token);
            return tokenDecoded;
        }));
        return tokenDecoded;
    }
}
exports.default = Utils;
Utils.isEmpty = (value) => {
    return (value === undefined ||
        value === null ||
        (typeof value === 'object' && Object.keys(value).length === 0) ||
        (typeof value === 'string' && value.trim().length === 0));
};
