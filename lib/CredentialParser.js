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
    constructor(authType, credentials) {
        this.authType = authType;
        this.credentials = credentials;
    }
    setLoginVariables() {
        let secrets = new actions_secret_parser_1.SecretParser(this.credentials, actions_secret_parser_1.FormatType.JSON);
        let authType = authenticationType_1.AuthenticationTypeUtil.FromString(core.getInput('authtype', { required: true }));
        switch (authType) {
            case authenticationType_1.AuthenticationTypeConst.AWS: {
                this.setAWSSecrets(secrets);
                break;
            }
            case authenticationType_1.AuthenticationTypeConst.Azure: {
                this.setAzureServicePrincipal(secrets);
                break;
            }
        }
    }
    setAWSSecrets(secrets) {
        let accessKeyId = secrets.getSecret('$.accessKeyId', false);
        let secretAccessKey = secrets.getSecret('$.secretAccessKey', true);
        if (!accessKeyId || !secretAccessKey) {
            throw new Error('Not all values are present in the creds object. Ensure accessKeyId and secretAccessKey are supplied');
        }
        process.env.AWS_ACCESS_KEY_ID = accessKeyId;
        process.env.AWS_SECRET_ACCESS_KEY = secretAccessKey;
        core.info('AWS Login settings configured.');
    }
    setAzureServicePrincipal(secrets) {
        let servicePrincipalId = secrets.getSecret('$.appId', false);
        let servicePrincipalKey = secrets.getSecret('$.password', false);
        let tenantId = secrets.getSecret('$.tenant', false);
        let subscriptionId = secrets.getSecret('$.subscriptionId', false);
        if (!servicePrincipalId || !servicePrincipalKey || !tenantId || !subscriptionId) {
            throw new Error('Not all values are present in the creds object. Ensure clientId, clientSecret, tenantId and subscriptionId are supplied');
        }
        process.env.AZURE_SUBSCRIPTION_ID = subscriptionId;
        process.env.AZURE_TENANT_ID = tenantId;
        process.env.AZURE_CLIENT_ID = servicePrincipalId;
        process.env.AZURE_CLIENT_SECRET = servicePrincipalKey;
        core.info('Azure Login settings configured.');
    }
}
exports.CredentialParser = CredentialParser;
