import {login} from "./login";
import {pages} from "../../pages";
import * as moment from "moment";
import * as puppeteer from "puppeteer";

export async function createContract(browser: puppeteer.Browser): Promise<boolean> {
	const page = await browser.newPage();

	await page.goto(pages.contractsAddURL);
	await page.waitForSelector('.ibox-content');

	const contractYear= process.env.TS_CONTRACT_YEAR;
	const contractMonth= process.env.TS_CONTRACT_MONTH;

	const dateString = `${contractYear}${contractMonth}`; // example date string
	const date = moment(dateString, 'YYYYMM').startOf('month');
	const startDate = date.startOf('month').format('MMDDYYYY');
	const endDate = date.endOf('month').format('MMDDYYYY');

	await page.select('#contract_type', '3');
	await page.select('#contract_work_form_bankAccount', process.env.TS_BANK_ACCOUNT_UUID);
	await page.type('#contract_work_form_signedAt', startDate);
	await page.type('#contract_work_form_expiresAt', endDate);
	await page.type('#contract_work_form_grossSalary', process.env.TS_CONTRACT_AMOUNT);
	await page.select('#contract_work_form_costOfIncome', '2');
	await page.type('#contract_work_form_subjectOfContract', process.env.TS_CONTRACT_SUBJECT);

	await Promise.all([
		page.waitForNavigation(),
		page.click('#contract_work_form_submit'),
	]);

	return true;
}

export async function downloadLastContract(browser: puppeteer.Browser): Promise<string> {
	const page = await browser.newPage();

	await page.goto(pages.contractsURL);
	await page.waitForSelector('.ibox-content');

	const documentNumber = await page.evaluate(() => {
		return document.querySelector('.table tbody tr:first-child .grid-column-number').textContent.trim();
	});
	let filename = documentNumber + ".pdf";
	filename = filename.replace(/\//g, '-');

	await page.click('.table tbody tr:first-child .grid-action-download');

	await page.waitForSelector('.ibox-content');

	return process.env.TS_DOWNLOAD_PATH + filename;
}

