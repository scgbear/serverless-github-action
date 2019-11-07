"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const authenticationType_1 = require("./constants/authenticationType");
const actions_secret_parser_1 = require("actions-secret-parser");
class CredentialParser {
    constructor(credentials) {
        this.credentials = credentials;
        this.authType = authenticationType_1.AuthenticationTypeUtil.FromCredentials(credentials);
    }
    setLoginVariables() {
        let secrets = new actions_secret_parser_1.SecretParser(this.credentials, actions_secret_parser_1.FormatType.JSON);
        switch (this.authType) {
            case authenticationType_1.AuthenticationTypeConst.AWS: {
                this.setAWSSecrets(secrets);
                break;
            }
            case authenticationType_1.AuthenticationTypeConst.Azure: {
                this.setAzureServicePrincipal(secrets);
                break;
            }
            default: {
                throw new Error('Invalid Authentication Type');
            }
        }
    }
    setAWSSecrets(secrets) {
        process.env.AWS_ACCESS_KEY_ID = secrets.getSecret('$.accessKeyId', false);
        process.env.AWS_SECRET_ACCESS_KEY = secrets.getSecret('$.secretAccessKey', true);
        core.info('AWS Login settings configured.');
    }
    setAzureServicePrincipal(secrets) {
        process.env.AZURE_SUBSCRIPTION_ID = secrets.getSecret('$.subscriptionId', false);
        process.env.AZURE_TENANT_ID = secrets.getSecret('$.tenant', false);
        process.env.AZURE_CLIENT_ID = secrets.getSecret('$.appId', false);
        process.env.AZURE_CLIENT_SECRET = secrets.getSecret('$.password', true);
        core.info('Azure Login settings configured.');
    }
}
exports.CredentialParser = CredentialParser;
