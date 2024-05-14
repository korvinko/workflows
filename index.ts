import { Command } from 'commander';
import {config} from 'dotenv';
import {actions} from "./actions.js";
import {createContract, downloadLastContract} from "./integrations/twojstartup/contract.js";
import {editPDF} from "./integrations/sejda/editPdf.js";
import {login} from "./integrations/twojstartup/login.js";
import {createBill, downloadLastBill} from "./integrations/twojstartup/bill.js";
import {fetchGptResponse} from "./integrations/openai/generateCode.js";
import {fetchGroqResponse} from "./integrations/groq/generateCode.js";
import {generatePDFFromHTML} from "./integrations/pdf/generatePdf.js";
import {createInvoice, downloadLastInvoice} from "./integrations/twojstartup/invoice.js";

const program = new Command();

config({ prefix: 'TS' } as any);

program
    .version('0.1.0')
    .description('CLI application for automation interaction with CRM of TwojStartup')
    .option('-t, --task <string>', 'Select task')
    .option('-s, --silent', 'Finish task automatically', false)
    .parse(process.argv);

program.parse();
const task = program.opts().task as actions;
const silent = program.opts().silent as boolean;

switch (task) {
    case actions.addInvoice: {
        login().then(browser => {
            createInvoice(browser, silent).then(_ => {
                downloadLastInvoice(browser).then(pdfFile => {
                    // sendItToReview(browser, pdfFile);
                });
            });
        });
        break;
    }
    case actions.addContract: {
        login().then(browser => {
            createContract(browser, silent).then(_ => {
                // downloadLastContract(browser).then(pdfFile => {
                //     editPDF(browser, pdfFile);
                // });
            });
        });
        break;
    }
    case actions.addBill: {
        login().then(browser => {
            createBill(browser, silent).then(_ => {
                // downloadLastBill(browser).then(pdfFile => {
                //     editPDF(browser, pdfFile);
                // });
            });
        });
        break;
    }
    case actions.generateCode: {
        // Initialize an empty conversation
        fetchGptResponse(process.env.TS_PROMT_TEXT).then(v => {
            console.log(v)
        });
        break;
    }
    case actions.generateCodeGroq: {
        // Initialize an empty conversation
        fetchGroqResponse(process.env.TS_PROMT_TEXT).then(v => {
            console.log(v)
        });
        break;
    }
    case actions.printPdf: {
        generatePDFFromHTML(process.env.TS_CODE_HTML_FOLDER);
        break;
    }
    default: {
        console.error("command has not been found");
    }
}



