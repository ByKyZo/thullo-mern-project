"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_routes_config_1 = require("./common.routes.config");
const user_controller_1 = require("../controllers/user.controller");
class UserRoutes extends common_routes_config_1.CommonRoutesConfig {
    constructor(app) {
        super(app, 'UserRoutes');
        this.configureRoutes();
    }
    configureRoutes() {
        this.app.route('/user/rememberme').get(user_controller_1.UserController.rememberMe);
        this.app.route('/user/register').post(user_controller_1.UserController.register);
        this.app.route('/user/login').post(user_controller_1.UserController.login);
        this.app.route('/user/all/:id').get(user_controller_1.UserController.getUsersByNotMatchBoardID);
        this.app
            .route('/user/:id')
            .get(user_controller_1.UserController.getUser)
            .delete(user_controller_1.UserController.delete)
            .patch(user_controller_1.UserController.update);
        return this.app;
    }
}
exports.default = UserRoutes;
