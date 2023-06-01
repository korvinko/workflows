import {pages} from "../../pages.js";
import * as puppeteer from "puppeteer";

export async function createBill(browser: puppeteer.Browser): Promise<boolean> {
	const page = await browser.newPage();

	await page.goto(pages.billsAddURL);
	await page.waitForSelector('.ibox-content');

	await Promise.all([
		await page.waitForFunction(() => {
			const element = document.querySelector('#bill-type') as HTMLFormElement;
			return element !== null && element.value !== '';
		}),
		page.click('#bill_form_submit'),
	]);

	return true;
}

export async function downloadLastBill(browser: puppeteer.Browser): Promise<string> {
	const page = await browser.newPage();

	await page.goto(pages.billsURL);
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

