import * as commander from 'commander';
import * as dotenv from 'dotenv';
import {actions} from "./actions";
import {createContract, downloadLastContract} from "./integrations/twojstartup/contract";
import {editPDF} from "./integrations/sejda/contract";
import {login} from "./integrations/twojstartup/login";

dotenv.config({ prefix: 'TS' } as any);

const program = commander.program
    .version('0.1.0')
    .description('CLI application for automation interaction with CRM of TwojStartup')
    .option('-t, --task <char>', 'Select task')
    .parse(process.argv);

program.parse();
const task = program.opts().task as actions;

switch (task) {
    case actions.addContract: {
        login().then(browser => {
            downloadLastContract(browser).then(pdfFile => {
                editPDF(browser, pdfFile);
            });
        });
        break;
    }
    case actions.addContract: {
        login().then(browser => {
            downloadLastContract(browser).then(pdfFile => {
                editPDF(browser, pdfFile);
            });
        });
        break;
    }
    default: {
        console.error("command has not been found");
    }
}



