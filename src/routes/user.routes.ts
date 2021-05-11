import { CommonRoutesConfig } from './common.routes.config';
import { Application } from 'express';
import { UserController } from '../controllers/user.controller';

export default class UserRoutes extends CommonRoutesConfig {
    constructor(app: Application) {
        super(app, 'UserRoutes');

        this.configureRoutes();
    }

    configureRoutes() {
        this.app.route('/user/rememberme').get(UserController.rememberMe);
        this.app.route('/user/register').post(UserController.register);
        this.app.route('/user/login').post(UserController.login);
        this.app.route('/user/all/:id').get(UserController.getUsersByNotMatchBoardID);
        this.app.route('/user/delete-notification').post(UserController.deleteNotification);

        this.app
            .route('/user/:id')
            .get(UserController.getUser)
            .delete(UserController.delete)
            .patch(UserController.update);

        return this.app;
    }
}
