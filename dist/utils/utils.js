"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Utils {
    static toObject(doc) {
        return JSON.parse(JSON.stringify(doc));
    }
}
exports.default = Utils;
