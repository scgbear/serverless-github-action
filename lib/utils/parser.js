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
const authentication_type_1 = require("../constants/authentication_type");
const actions_secret_parser_1 = require("actions-secret-parser");
function parseLoginVariables() {
    let creds = core.getInput('credentialssecret', { required: true });
    let secrets = new actions_secret_parser_1.SecretParser(creds, actions_secret_parser_1.FormatType.JSON);
    let authType = authentication_type_1.AuthenticationTypeUtil.FromString(secrets.getSecret("$.authType", false));
    switch (authType) {
        case authentication_type_1.AuthenticationTypeConst.AWS: {
            parseAWSSecrets(secrets);
            break;
        }
        case authentication_type_1.AuthenticationTypeConst.Azure: {
            parseAzureServicePrincipal(secrets);
            break;
        }
    }
}
exports.parseLoginVariables = parseLoginVariables;
function parseAWSSecrets(secrets) {
    let accessKeyId = secrets.getSecret("$.accessKeyId", false);
    let secretAccessKey = secrets.getSecret("$.secretAccessKey", true);
    if (!accessKeyId || !secretAccessKey) {
        throw new Error("Not all values are present in the creds object. Ensure accessKeyId and secretAccessKey are supplied");
    }
    process.env.AWS_ACCESS_KEY_ID = accessKeyId;
    process.env.AWS_SECRET_ACCESS_KEY = secretAccessKey;
    console.log("AWS Login settings configured.");
}
function parseAzureServicePrincipal(secrets) {
    let servicePrincipalId = secrets.getSecret("$.clientId", false);
    let servicePrincipalKey = secrets.getSecret("$.clientSecret", true);
    let tenantId = secrets.getSecret("$.tenantId", false);
    let subscriptionId = secrets.getSecret("$.subscriptionId", false);
    if (!servicePrincipalId || !servicePrincipalKey || !tenantId || !subscriptionId) {
        throw new Error("Not all values are present in the creds object. Ensure clientId, clientSecret, tenantId and subscriptionId are supplied");
    }
    process.env.AZURE_SUBSCRIPTION_ID = subscriptionId;
    process.env.AZURE_TENANT_ID = tenantId;
    process.env.AZURE_CLIENT_ID = servicePrincipalId;
    process.env.AZURE_CLIENT_SECRET = servicePrincipalKey;
    console.log("Azure Login settings configured.");
}
