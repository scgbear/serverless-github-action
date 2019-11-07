"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const slsCli_1 = require("./slsCli");
const CredentialParser_1 = require("./CredentialParser");
const initializeServerless_1 = require("./initializeServerless");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const version = require('../package.json').version;
            console.log(`Running serverless action v${version}...`);
            const yamlFile = core.getInput('yamlFile');
            core.debug(`yamlFile=${yamlFile}`);
            const creds = core.getInput('credentials', { required: true });
            const slsOptions = {
                command: 'version',
                yamlFile: yamlFile,
                credentials: creds,
            };
            const credentialParser = new CredentialParser_1.CredentialParser(creds);
            credentialParser.setLoginVariables();
            initializeServerless_1.initServerless();
            const output = yield slsCli_1.SlsCli.run(slsOptions);
            console.log(`serverless stdout:\n\n${output.stdout}`);
            if (output.stderr) {
                core.setFailed(output.stderr);
            }
            core.setOutput('time', new Date().toTimeString());
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
