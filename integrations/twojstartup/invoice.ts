import {pages} from "../../pages.js";
import * as puppeteer from "puppeteer";
import moment from "moment";
import {getCurrencyBuyRate} from "../nbpl/rates.js";
import {clickAndWaitForNavigation, selectOptionByText} from "../../helpers/selector.js";

export async function createInvoice(browser: puppeteer.Browser, silent: boolean): Promise<boolean> {
	const page = await browser.newPage();

	await page.goto(pages.invoiceAddURL);
	await page.waitForSelector('.ibox-content');

	const invoiceYear= process.env.TS_INVOICE_YEAR;
	const invoiceMonth= process.env.TS_INVOICE_MONTH;
	const company= process.env.TS_COMPANY;

	const currencyRate = await getCurrencyBuyRate(process.env.TS_INVOICE_TRANSFER_CURRENCY_CODE);

	const dateString = `${invoiceYear}${invoiceMonth}`; // example date string
	const date = moment(dateString, 'YYYYMM').startOf('month');
	const startDateComment = moment(dateString, 'YYYYMM').startOf('month').format('MM/DD/YYYY');
	const endDateComment = moment(dateString, 'YYYYMM').endOf('month').format('MM/DD/YYYY');
	const endInvoiceDate = date.endOf('month').format('MMDDYYYY');
	const invoiceExpiredAt = date.startOf('month').add(1, 'months').endOf('month').format('MMDDYYYY');

	const comment = `Beneficiary - Fundacja Rozwoju Przedsiębiorczości "Twój StartUp". Period - ${startDateComment} - ${endDateComment}`;

	await page.type('#sales_invoice_proforma_form_soldAt', endInvoiceDate);
	await page.click('#sales_invoice_proforma_form_mailOnStatusChange');
	await page.type('#sales_invoice_proforma_form_contractorName', company);
	await page.waitForFunction(() => {
		const element = document.querySelector('.ui-menu-item-wrapper:first-of-type') as HTMLFormElement;
		return element !== null;
	});
	await page.click('.ui-menu-item-wrapper:first-of-type');
	await page.keyboard.press('Tab');

	await page.select('#sales_invoice_proforma_form_payment_transaction', process.env.TS_INVOICE_TRANSFER_TYPE);
	await page.type('#sales_invoice_proforma_form_payment_expiresAt', invoiceExpiredAt);
	await selectOptionByText(page, '#sales_invoice_proforma_form_currency', process.env.TS_INVOICE_TRANSFER_CURRENCY_TITLE);
	await page.type('#sales_invoice_proforma_form_payment_exchange', currencyRate.toString());
	await selectOptionByText(page, '#sales_invoice_proforma_form_bankAccount', process.env.TS_INVOICE_TRANSFER_BANK_ACCOUNT);

	await page.type('#sales_invoice_proforma_form_comment', comment);


	await page.click('#proformaItemProductsAdd');
	await page.evaluate(() => {
		let element = document.querySelector('.ui-menu-item-wrapper');
		if (element) {
			element.remove();
		}
	});
	await page.type('.proformaItems input[type=text].ui-autocomplete-input', process.env.TS_INVOICE_PRODUCT_NAME);
	await page.waitForFunction(() => {
		const element = document.querySelector('.ui-menu-item-wrapper:first-of-type') as HTMLFormElement;
		return element !== null;
	});
	await page.click('.ui-menu-item-wrapper:first-of-type');
	await page.keyboard.press('Tab');
	await page.waitForFunction(() => {
		const element = document.querySelector('#sales_invoice_proforma_form_products_0_amount') as HTMLFormElement;

		return element.value > 0;
	});

	await page.click('#sales_invoice_proforma_form_products_0_amount', { clickCount: 3 });
	await page.keyboard.press('Backspace'); // delete the selected text
	await page.type('#sales_invoice_proforma_form_products_0_amount', "1");

	await clickAndWaitForNavigation(page, '#sales_invoice_proforma_form_submit', silent);

	return true;
}

export async function downloadLastInvoice(browser: puppeteer.Browser): Promise<string> {
	const page = await browser.newPage();

	await page.goto(pages.invoicesURL);
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

