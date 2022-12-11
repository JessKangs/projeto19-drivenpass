"use strict";
exports.__esModule = true;
exports.requestError = void 0;
function requestError(status, message) {
    return {
        name: "RequestError",
        status: status,
        message: message
    };
}
exports.requestError = requestError;
//# sourceMappingURL=request-error.js.map