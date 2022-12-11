"use strict";
exports.__esModule = true;
exports.authenticationRouter = void 0;
var express_1 = require("express");
var auth_joi_middleware_1 = require("../middlewares/auth-joi-middleware");
var authentication_controller_1 = require("@/controllers/authentication-controller");
var authenticationRouter = (0, express_1.Router)();
exports.authenticationRouter = authenticationRouter;
console.log("ROUTER");
authenticationRouter.post("/signup", auth_joi_middleware_1.signUpIsValid, authentication_controller_1.createSignUp);
authenticationRouter.post("/signin", auth_joi_middleware_1.signInIsValid, authentication_controller_1.createSignIn);
//# sourceMappingURL=authetication-router.js.map