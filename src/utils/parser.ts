import * as core from '@actions/core';
import {AuthenticationTypeUtil, AuthenticationTypeConst } from '../constants/authentication_type';
import { FormatType, SecretParser } from 'actions-secret-parser';

export function parseLoginVariables() {
    let creds = core.getInput('credentialssecret', { required: true });
    let secrets = new SecretParser(creds, FormatType.JSON);
    let authType = AuthenticationTypeUtil.FromString(core.getInput('authtype', { required: true }));
    switch (authType) {
        case AuthenticationTypeConst.AWS : {
            parseAWSSecrets(secrets);
            break;
        }
        case AuthenticationTypeConst.Azure : {
            parseAzureServicePrincipal(secrets);
            break;
        }
    }
}

function parseAWSSecrets(secrets:SecretParser) {
    let accessKeyId = secrets.getSecret('$.accessKeyId', false);
    let secretAccessKey = secrets.getSecret('$.secretAccessKey', true);
    if (!accessKeyId || !secretAccessKey) {
        throw new Error('Not all values are present in the creds object. Ensure accessKeyId and secretAccessKey are supplied');
    }

    core.exportVariable('AWS_ACCESS_KEY_ID',  accessKeyId);
    core.exportVariable('AWS_SECRET_ACCESS_KEY',  accessKeyId);
    
    core.info('AWS Login settings configured.');    
}

function parseAzureServicePrincipal(secrets:SecretParser) {
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
