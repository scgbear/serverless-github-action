import * as core from '@actions/core';
import { CredentialParser } from './CredentialParser';
import {AuthenticationTypeUtil } from './constants/authenticationType';

async function run() {
  try {
    const creds = core.getInput('credentialssecret', { required: true });
    const authType = AuthenticationTypeUtil.FromString(core.getInput('authtype', { required: true }));

    const credentialParser = new CredentialParser(authType, creds);
    credentialParser.setLoginVariables();

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
