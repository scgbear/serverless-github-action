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
    let authType = authentication_type_1.AuthenticationTypeUtil.FromString(core.getInput('authtype', { required: true }));
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
    let accessKeyId = secrets.getSecret('$.accessKeyId', false);
    let secretAccessKey = secrets.getSecret('$.secretAccessKey', true);
    if (!accessKeyId || !secretAccessKey) {
        throw new Error('Not all values are present in the creds object. Ensure accessKeyId and secretAccessKey are supplied');
    }
    core.exportVariable('AWS_ACCESS_KEY_ID', accessKeyId);
    core.exportVariable('AWS_SECRET_ACCESS_KEY', accessKeyId);
    core.info('AWS Login settings configured.');
}
function parseAzureServicePrincipal(secrets) {
    let servicePrincipalId = secrets.getSecret('$.appId', false);
    let servicePrincipalKey = secrets.getSecret('$.password', true);
    let tenantId = secrets.getSecret('$.tenant', false);
    let subscriptionId = secrets.getSecret('$.subscriptionId', false);
    if (!servicePrincipalId || !servicePrincipalKey || !tenantId || !subscriptionId) {
        throw new Error('Not all values are present in the creds object. Ensure clientId, clientSecret, tenantId and subscriptionId are supplied');
    }
    core.exportVariable('AZURE_SUBSCRIPTION_ID', subscriptionId);
    core.exportVariable('AZURE_TENANT_ID', tenantId);
    core.exportVariable('AZURE_CLIENT_ID', servicePrincipalId);
    core.exportVariable('AZURE_CLIENT_SECRET', servicePrincipalKey);
    core.info('Azure Login settings configured.');
}
