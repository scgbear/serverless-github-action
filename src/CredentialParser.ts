import * as core from '@actions/core';
import { AuthenticationTypeConst } from './constants/authenticationType';
import { FormatType, SecretParser } from 'actions-secret-parser';

export class CredentialParser {
    authType: AuthenticationTypeConst;
    credentials: string;

    constructor(authType: AuthenticationTypeConst, credentials: string) {
        this.authType = authType;
        this.credentials = credentials;
    }

    setLoginVariables() {
        let secrets = new SecretParser(this.credentials, FormatType.JSON);
        switch (this.authType) {
            case AuthenticationTypeConst.AWS : {
                this.setAWSSecrets(secrets);
                break;
            }
            case AuthenticationTypeConst.Azure : {
                this.setAzureServicePrincipal(secrets);
                break;
            }
            default : {
                throw new Error('Invalid Authentication Type')
            }
        }
    }

    setAWSSecrets(secrets:SecretParser) {
        let accessKeyId = secrets.getSecret('$.accessKeyId', false);
        let secretAccessKey = secrets.getSecret('$.secretAccessKey', true);
        if (!accessKeyId || !secretAccessKey) {
            throw new Error('Not all values are present in the creds object. Ensure accessKeyId and secretAccessKey are supplied');
        }
    
        process.env.AWS_ACCESS_KEY_ID = accessKeyId;
        process.env.AWS_SECRET_ACCESS_KEY = secretAccessKey;
        
        core.info('AWS Login settings configured.');    
    }

    setAzureServicePrincipal(secrets:SecretParser) {
        let servicePrincipalId = secrets.getSecret('$.appId', false);
        let servicePrincipalKey = secrets.getSecret('$.password', true);
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
