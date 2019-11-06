import * as core from '@actions/core';
import { parseLoginVariables } from './utils/parser';

async function run() {
  try {
    parseLoginVariables();

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
