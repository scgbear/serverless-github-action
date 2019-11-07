import {execSync} from './utility';

export function initServerless() {
    execSync("npm", "install -g serverless");
}