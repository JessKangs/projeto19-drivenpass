"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.loadEnv = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
function loadEnv() {
    var path = process.env.NODE_ENV === "test"
        ? ".env.test"
        : process.env.NODE_ENV === "development"
            ? ".env.development"
            : ".env";
    dotenv_1["default"].config({ path: path });
}
exports.loadEnv = loadEnv;
//# sourceMappingURL=envs.js.map