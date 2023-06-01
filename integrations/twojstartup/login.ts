import * as puppeteer from "puppeteer";
import {pages} from "../../pages.js";

export async function login(): Promise<puppeteer.Browser> {
	const options = {
		headless: false,
		args: ['--no-sandbox', '--disable-setuid-sandbox']
	} as any;
	if (process.env.TS_BROWSER !== undefined) {
		options.executablePath = process.env.TS_BROWSER;
	}

	const browser = await puppeteer.launch(options);
	const page = await browser.newPage();

	await page.goto(pages.loginUrl);
	await page.waitForSelector('form');

	// Fill out login form and submit
	await page.type('input[name="_username"]', process.env.TS_USERNAME);
	await page.type('input[name="_password"]', process.env.TS_PASSWORD);
	await Promise.all([
		page.waitForNavigation(),
		page.click('button[type="submit"]'),
	]);

	await page.waitForSelector('.side-menu');

	const cookies = await page.cookies();
	console.log(cookies[0].name, cookies[0].value);

	return browser;
}

