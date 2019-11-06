"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AuthenticationTypeConst;
(function (AuthenticationTypeConst) {
    AuthenticationTypeConst[AuthenticationTypeConst["AWS"] = 1] = "AWS";
    AuthenticationTypeConst[AuthenticationTypeConst["Azure"] = 2] = "Azure";
})(AuthenticationTypeConst = exports.AuthenticationTypeConst || (exports.AuthenticationTypeConst = {}));
class AuthenticationTypeUtil {
    static FromString(type) {
        let typeInLowerCase = type.trim().toLocaleLowerCase();
        if (typeInLowerCase === 'aws') {
            return AuthenticationTypeConst.AWS;
        }
        else {
            return AuthenticationTypeConst.Azure;
        }
    }
}
exports.AuthenticationTypeUtil = AuthenticationTypeUtil;
