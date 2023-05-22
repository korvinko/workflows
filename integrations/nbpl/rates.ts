import fs from 'fs';

export async function getCurrencyBuyRate(currency: string): Promise<any> {
	const response = await fetch(`http://api.nbp.pl/api/exchangerates/rates/c/${currency}/today/?format=json`);
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







