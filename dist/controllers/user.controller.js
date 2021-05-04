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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
class UserController {
    static register(req, res) {
        const { pseudo, email, password } = req.body;
        // const user = await UserModel.create({ pseudo: 'Alex', email: 'email', password: 'password' })
        // res.send(userRegister);
        res.send('Hello from Register');
    }
    static login(req, res) {
        res.send('Hello from Login');
    }
    static getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.send('Hello from getUser');
        });
    }
    static delete(req, res) {
        res.send('Hello from Delete');
    }
    static update(req, res) {
        res.send('Hello from Update');
    }
}
exports.UserController = UserController;
