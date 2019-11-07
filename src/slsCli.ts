import * as core from '@actions/core';
import { SlsOptions } from './slsOptions';
import { execSync, IExecSyncResult, IExecSyncOptions } from './utility';

export class SlsCli {
  public static async run(slsOptions: SlsOptions) {
    throwIfError(execSync("serverless", "--version"));
    const response = execSync("serverless", slsOptions.command);
    return response;
  }
}

function throwIfError(resultOfToolExecution: IExecSyncResult, errormsg?: string) {
  if (resultOfToolExecution.code != 0) {
      core.error("Error Code: [" + resultOfToolExecution.code + "]");
      if (errormsg) {
        core.error("Error: " + errormsg);
      }
      throw resultOfToolExecution;
  }
}
