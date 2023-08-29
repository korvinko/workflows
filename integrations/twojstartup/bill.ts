import {pages} from "../../pages.js";
import * as puppeteer from "puppeteer";
import {clickAndWaitForNavigation} from "../../helpers/selector.js";

export async function createBill(browser: puppeteer.Browser, silent: boolean): Promise<boolean> {
	const page = await browser.newPage();

	await page.goto(pages.billsAddURL);
	await page.waitForSelector('.ibox-content');

	await page.waitForFunction(() => {
		const element = document.querySelector('#bill-type') as HTMLFormElement;
		return element !== null && element.value !== '';
	})

	await clickAndWaitForNavigation(page, '$bill_form_submit', silent);

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

