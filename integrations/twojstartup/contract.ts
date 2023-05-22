import {pages} from "../../pages.js";
import * as puppeteer from "puppeteer";
import moment from "moment";
import {selectOptionByText} from "../../helpers/selector.js";
import {clearTextField} from "../../helpers/text.js";
import {umowa} from "../../contacts.js";

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

	await page.select('#contract_type', process.env.TS_CONTRACT_TYPE);
	if (process.env.TS_CONTRACT_TYPE == umowa.dzieło) {
		await selectOptionByText(page, '#contract_work_form_bankAccount', process.env.TS_CONTRACT_BANK_ACCOUNT);
		await page.type('#contract_work_form_signedAt', startDate);
		await page.type('#contract_work_form_expiresAt', endDate);
		await clearTextField(page, '#contract_work_form_grossSalary');
		await page.type('#contract_work_form_grossSalary', process.env.TS_CONTRACT_AMOUNT_DZIELO);
		await page.select('#contract_work_form_costOfIncome', '2');
		await page.type('#contract_work_form_subjectOfContract', process.env.TS_CONTRACT_SUBJECT_DZIELO);
	}
	if (process.env.TS_CONTRACT_TYPE == umowa.zlecenie) {
		await selectOptionByText(page, '#contract_of_mandate_form_bankAccount', process.env.TS_CONTRACT_BANK_ACCOUNT);
		await page.type('#contract_of_mandate_form_signedAt', startDate);
		await page.type('#contract_of_mandate_form_expiresAt', endDate);
		await clearTextField(page, '#contract_of_mandate_form_grossSalary');
		await page.type('#contract_of_mandate_form_grossSalary', process.env.TS_CONTRACT_AMOUNT_ZLECENIE);
		await page.select('#contract_work_form_costOfIncome', '1');
		await page.type('#contract_of_mandate_form_subjectOfContract', process.env.TS_CONTRACT_SUBJECT_ZLECENIE);
	}

	await Promise.all([
		page.waitForNavigation(),
		// page.click('#contract_work_form_submit'),
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

