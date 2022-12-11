"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.signInIsValid = exports.signUpIsValid = void 0;
var http_status_1 = __importDefault(require("http-status"));
var joi_1 = __importDefault(require("joi"));
var loginSchema = joi_1["default"].object({
    email: joi_1["default"].string().email().required(),
    password: joi_1["default"].required()
});
var signUpSchema = joi_1["default"].object({
    email: joi_1["default"].string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: joi_1["default"].string().min(10)
});
function signInIsValid(req, res, next) {
    var _a = req.body, email = _a.email, password = _a.password;
    var validation = loginSchema.validate({ email: email, password: password }, { abortEarly: true });
    if (validation.error) {
        res.status(http_status_1["default"].UNPROCESSABLE_ENTITY).send(validation.error);
    }
    else {
        next();
    }
}
exports.signInIsValid = signInIsValid;
function signUpIsValid(req, res, next) {
    var _a = req.body, email = _a.email, password = _a.password;
    var validation = signUpSchema.validate({ email: email, password: password }, { abortEarly: true });
    if (validation.error) {
        res.status(http_status_1["default"].UNPROCESSABLE_ENTITY).send(validation.error);
    }
    else {
        next();
    }
}
exports.signUpIsValid = signUpIsValid;
//# sourceMappingURL=auth-joi-middleware.js.map