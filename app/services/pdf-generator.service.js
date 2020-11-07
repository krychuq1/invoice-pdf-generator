import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import handlebars from 'handlebars'
import Handlebars from "handlebars";
import moment from 'moment'
Handlebars.registerHelper('date', (date) => {
    return moment(date).format('DD.MM.YYYY');
});
Handlebars.registerHelper("inc", (value, options) => {
    return parseInt(value) + 1;
});
Handlebars.registerHelper('decimal', (price) => {
    return (Math.round(price * 100) / 100).toFixed(2);
});
Handlebars.registerHelper('voucherDiscount', (order) => {
    const val = ((order.total - order.shipping.shippingPrice) * 100 / (100 - order.voucher.pctDiscount)) * order.voucher.pctDiscount / 100;
    const price = (Math.round(val * 100) / 100).toFixed(2);
    return price
});
class PdfGeneratorService{
    constructor() {}

   async getBase64(filename) {
        return fs.readFileSync('invoices/' + filename).toString('base64');
   }
   async generatePdf(order, filename, invoiceNr) {
        try {
            console.log(order);
        const dataBinding = {
            buyer: order.billingAddress,
            order: order,
            invoiceNr: invoiceNr
        }
        const templateHtml = fs.readFileSync(path.join(process.cwd() + '/invoice-template.html'), 'utf8');
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
            path: 'invoices/' + filename
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
