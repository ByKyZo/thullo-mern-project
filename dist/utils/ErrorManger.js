"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorManager {
    static checkErrors(possibleError, err) {
        const errors = {};
        possibleError.forEach((error) => {
            if (err.message.includes(error)) {
                const messageStartIndex = err.message.indexOf(':');
                const errMessage = err.message.substring(messageStartIndex).replace(':', '').trim();
                errors[error] = errMessage;
            }
        });
        return errors;
    }
}
exports.default = ErrorManager;
