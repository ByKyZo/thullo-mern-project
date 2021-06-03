import { CommonRoutesConfig } from './common.routes.config';
import { Application } from 'express';
import { UserController } from '../controllers/user.controller';

export default class UserRoutes extends CommonRoutesConfig {
    constructor(app: Application) {
        super(app, 'UserRoutes');

        this.configureRoutes();
    }

    configureRoutes() {
        this.app.route('/api/user/rememberme').get(UserController.rememberMe);
        this.app.route('/api/user/register').post(UserController.register);
        this.app.route('/api/user/login').post(UserController.login);
        this.app.route('/api/user/all/:id').get(UserController.getUsersByNotMatchBoardID);
        this.app.route('/api/user/delete-notification').post(UserController.deleteNotification);

        this.app
            .route('/api/user/:id')
            .get(UserController.getUser)
            .delete(UserController.delete)
            .patch(UserController.update);

        return this.app;
    }
}
