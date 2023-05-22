import {pages} from "../../pages.js";
import * as puppeteer from "puppeteer";

export async function editPDF(browser: puppeteer.Browser, pdfFile: string): Promise<boolean> {
	const page = await browser.newPage();

	await page.goto(pages.sejdaEditPDFURL);
	await page.waitForSelector('input.fileupload');

	// Select the file input element
	const fileInput = await page.$('input.fileupload');

	// Upload the file
	await fileInput.uploadFile(pdfFile); // Replace with the actual path to your file

	return true;
}

