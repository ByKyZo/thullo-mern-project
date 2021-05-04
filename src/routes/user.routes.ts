import { CommonRoutesConfig } from './common.routes.config';
import { Application, Request, Response } from 'express';
import { UserController } from '../controllers/user.controller';
import express from 'express';


export class UserRoutes extends CommonRoutesConfig {

    constructor(app: Application) {
        super(app, 'UserRoutes')

        this.configureRoutes();
    }

    configureRoutes() {

        this.app.route('/user/register').post(UserController.register)

        this.app.route('/user/login').post(UserController.login)

        this.app.route('/user/:id')
            .get(UserController.getUser)
            .delete(UserController.delete)
            .patch(UserController.update)

        return this.app;
    }
}

