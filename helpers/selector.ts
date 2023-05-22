import {Page} from "puppeteer";

export async function selectOptionByText(page: Page, selector: string, text: string): Promise<void> {
    const optionValue = await page.evaluate((selector, text) => {
        const select = document.querySelector(selector) as HTMLSelectElement;
        for (const option of Array.from(select.options)) {
            if (option.text.includes(text)) {
                return option.value;
            }
        }
    }, selector, text);

    await page.select(selector, optionValue);
}