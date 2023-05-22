import { Page } from 'puppeteer';

export async function clearTextField(page: Page, selector: string): Promise<void> {
    // Focus the input field
    await page.focus(selector);

    // Select all text and delete it
    await page.keyboard.down('Control'); // or 'Meta' on Mac
    await page.keyboard.press('KeyA');
    await page.keyboard.up('Control'); // or 'Meta' on Mac
    await page.keyboard.press('Backspace');
}