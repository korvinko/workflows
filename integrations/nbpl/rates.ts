import fs from 'fs';
import moment from 'moment';

export async function getCurrencyBuyRate(currency: string): Promise<any> {
	const date = getWorkingDayDate().format('YYYY-MM-DD');
	const response = await fetch(`http://api.nbp.pl/api/exchangerates/rates/c/${currency}/${date}/?format=json`);
	const data = await response.json();

	return data.rates[0].bid;
}

export async function validator(currency: string): Promise<any> {
	const allCurrencies = await currencies();

	return allCurrencies[currency.toUpperCase()];
}

export async function currencies(): Promise<any> {
	try {
		const data = await fs.promises.readFile('integrations/nbpl/currencies.json', 'utf8');
		return JSON.parse(data);
	} catch (err) {
		console.error('Error:', err);
	}
}

function getWorkingDayDate(): moment.Moment {
	let date = moment();

	// If it's Saturday or Sunday, set the date to the last Friday
	if (date.day() === 0) { // Sunday
		date = moment().subtract(2, 'days');
	} else if (date.day() === 6) { // Saturday
		date = moment().subtract(1, 'days');
	}

	return date;
}







