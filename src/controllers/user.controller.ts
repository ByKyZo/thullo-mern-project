import { Request, Response } from 'express';
import UserModel from '../models/user.model';

export class UserController {

    public static register(req: Request, res: Response) {
        const { pseudo, email, password } = req.body;
        // const user = await UserModel.create({ pseudo: 'Alex', email: 'email', password: 'password' })
        // res.send(userRegister);
        res.send('Hello from Register');
    }
    public static login(req: Request, res: Response) {
        res.send('Hello from Login');
    }
    public static async getUser(req: Request, res: Response) {
        res.send('Hello from getUser');
    }
    public static delete(req: Request, res: Response) {
        res.send('Hello from Delete');
    }
    public static update(req: Request, res: Response) {
        res.send('Hello from Update');
    }
}