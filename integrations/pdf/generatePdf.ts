import * as puppeteer from "puppeteer";
import * as fs from "fs";
import * as path from "path";

export async function generatePDF(code: string) {

	// Replace new line characters with <br> tags
	const formattedResponse = code.replace(/\n/g, '<br>');

	// Create an HTML string
	const html = `<html><body><pre>${formattedResponse}</pre></body></html>`;

	// Launch a new browser instance
	const browser = await puppeteer.launch();

	// Open a new page
	const page = await browser.newPage();

	// Set the HTML content of the page
	await page.setContent(html, {
		waitUntil: 'networkidle0',  // Wait until the network is idle to ensure all content is loaded
	});

	// Generate the PDF with a default margin
	const pdf = await page.pdf({format: 'A4', margin: {top: '1cm', right: '1cm', bottom: '1cm', left: '1cm'}});

	// Write the PDF to a file
	require('fs').writeFileSync('output.pdf', pdf);

	// Close the browser
	await browser.close();
}

export async function generatePDFFromHTML(directoryPath: string) {
	const files = fs.readdirSync(directoryPath);

	for (const file of files) {
		const filePath = path.join(directoryPath, file);

		if (fs.statSync(filePath).isDirectory()) {
			await generatePDFFromHTML(filePath);
		} else if (path.extname(file) === '.html') {
			await generatePDFPup(filePath);
		}
	}
}

export async function generatePDFPup(filePath) {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	const htmlContent = fs.readFileSync(filePath, 'utf8');
	await page.setContent(htmlContent);

	const pdfPath = filePath.replace('.html', '.pdf');
	await page.pdf({ path: pdfPath });

	console.log(`PDF generated for ${filePath} and saved as ${pdfPath}`);

	await browser.close();
}

//
// export function generatePDF(code: string) {
//     // Create a new PDFDocument
//     const doc = new PDFDocument;
//
//     // Pipe its output to a file
//     doc.pipe(fs.createWriteStream('output.pdf'));
//
//     // Set the font and font size
//     doc.font('Courier').fontSize(13);
//
//     // Split response into paragraphs
//     const paragraphs = code.split('\n');
//
//     // // Add each paragraph to the document, replacing tabs with four spaces
//     // paragraphs.forEach(paragraph => {
//     //     const formattedParagraph = paragraph.replace(/\t/g, '    ');
//     //     doc.text(formattedParagraph);
//     //
//     //     // Add a bit of extra space between paragraphs
//     //     doc.moveDown();
//     // });
//
//     // Add each paragraph to the document, replacing tabs with four spaces
//     paragraphs.forEach(paragraph => {
//         const formattedParagraph = paragraph.replace(/\t/g, '    ');
//         doc.text(formattedParagraph, { lineGap: -10 }); // Adjust lineGap as needed
//
//         // Add a bit of extra space between paragraphs
//         if (paragraph !== paragraphs[paragraphs.length - 1]) {
//             doc.moveDown();
//         }
//     });
//
//     // Finalize the PDF and end the stream
//     doc.end();
// }
