import { CredentialParser } from './CredentialParser';
import { AuthenticationTypeConst } from './constants/authenticationType'

test('aws credentials can be parsed', async () => {
    const credentials = {
        accessKeyId: 'I am an access id',
        secretAccessKey: 'I am super secret',
    }

    const credentialParser = new CredentialParser(AuthenticationTypeConst.AWS, JSON.stringify(credentials));

    credentialParser.setLoginVariables();

    expect(process.env.AWS_ACCESS_KEY_ID).toEqual(credentials.accessKeyId);
    expect(process.env.AWS_SECRET_ACCESS_KEY).toEqual(credentials.secretAccessKey);
});

test('azure credentials can be parsed', async () => {
    const credentials = {
        appId: 'I am an application id',
        password: 'I am super secret',
        tenant: 'What tenant id',
        subscriptionId: 'The sub has been identified',
    }

    const credentialParser = new CredentialParser(AuthenticationTypeConst.Azure, JSON.stringify(credentials));

    credentialParser.setLoginVariables();

    expect(process.env.AZURE_CLIENT_ID).toEqual(credentials.appId);
    expect(process.env.AZURE_CLIENT_SECRET).toEqual(credentials.password);
    expect(process.env.AZURE_TENANT_ID).toEqual(credentials.tenant);
    expect(process.env.AZURE_SUBSCRIPTION_ID).toEqual(credentials.subscriptionId);
});

test.each([
        [AuthenticationTypeConst.Azure, JSON.stringify({
            appId: 'I am an application id',
            tenant: 'What tenant id',
            subscriptionId: 'The sub has been identified',
        })],
        [AuthenticationTypeConst.Azure, JSON.stringify({
            password: 'I am super secret',
            tenant: 'What tenant id',
            subscriptionId: 'The sub has been identified',
        })],
        [AuthenticationTypeConst.Azure, JSON.stringify({
            appId: 'I am an application id',
            password: 'I am super secret',
            subscriptionId: 'The sub has been identified',
        })],
        [AuthenticationTypeConst.Azure, JSON.stringify({
            appId: 'I am an application id',
            password: 'I am super secret',
            tenant: 'What tenant id',
        })],
        [AuthenticationTypeConst.AWS, JSON.stringify({
            secretAccessKey: 'I am super secret',
        })],
        [AuthenticationTypeConst.AWS, JSON.stringify({
            accessKeyId: 'I am an access id',
        })],
    ])(
    'missing property throws an error', missingInfoError);

function missingInfoError(authType, credentials) {
    const credentialParser = new CredentialParser(authType, credentials);

    expect(credentialParser.setLoginVariables).toThrowError();
}

test('invalid auth type throws error', async () => {
    const credentials = {
        accessKeyId: 'I am an access id',
        secretAccessKey: 'I am super secret',
    }

    const credentialParser = new CredentialParser(3, JSON.stringify(credentials));

    expect(credentialParser.setLoginVariables).toThrowError;
});
