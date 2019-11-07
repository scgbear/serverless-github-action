"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AuthenticationTypeConst;
(function (AuthenticationTypeConst) {
    AuthenticationTypeConst[AuthenticationTypeConst["AWS"] = 1] = "AWS";
    AuthenticationTypeConst[AuthenticationTypeConst["Azure"] = 2] = "Azure";
})(AuthenticationTypeConst = exports.AuthenticationTypeConst || (exports.AuthenticationTypeConst = {}));
class AuthenticationTypeUtil {
    static FromCredentials(credentials) {
        const creds = JSON.parse(credentials);
        if (creds.appId && creds.password && creds.tenant && creds.subscriptionId) {
            return AuthenticationTypeConst.Azure;
        }
        if (creds.accessKeyId && creds.secretAccessKey) {
            return AuthenticationTypeConst.AWS;
        }
        throw new Error('Invalid credentials provided');
    }
}
exports.AuthenticationTypeUtil = AuthenticationTypeUtil;
