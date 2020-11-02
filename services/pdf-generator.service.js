import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import handlebars from 'handlebars'
import Handlebars from "handlebars";
import moment from 'moment'
Handlebars.registerHelper('date', (date) => {
    return moment(date).format('DD.MM.YYYY');
});

class PdfGeneratorService{
    constructor() {}

   async generatePdf(order) {
        try {
            console.log(order);
        const dataBinding = {
            buyer: order.billingAddress,
            order: order,
            invoiceNr: 'FS/1/2020'
        }
        const templateHtml = fs.readFileSync(path.join(process.cwd() + '\\invoice-template.html'), 'utf8');
        const template = handlebars.compile(templateHtml);
        const finalHtml = encodeURIComponent(template(dataBinding));
        const options = {
            format: 'A4',
            headerTemplate: "<p></p>",
            footerTemplate: "<p></p>",
            displayHeaderFooter: false,
            margin: {
                top: "40px",
                bottom: "100px"
            },
            printBackground: true,
            path: 'invoice.pdf'
        }

        const browser = await puppeteer.launch({
            args: ['--no-sandbox'],
            headless: true
        });
        const page = await browser.newPage();
        await page.goto(`data:text/html;charset=UTF-8,${finalHtml}`, {
            waitUntil: 'networkidle0'
        });
        await page.pdf(options);
        await browser.close();
        console.log('Done: invoice.pdf is created!')
    } catch (err) {
            console.log('ERROR:', err);
        }
    }
}
const pdfGeneratorService = new PdfGeneratorService();
export default pdfGeneratorService;
