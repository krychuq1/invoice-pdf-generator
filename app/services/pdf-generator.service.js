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
    const val1 = ((order.total - order.shipping.shippingPrice) * 100 / (100 - order.voucher.pctDiscount)) * order.voucher.pctDiscount / 100;
    // const price1 = Money.fromDecimal(val, 'pln', Math.ceil).amount / 100;
    // return (Math.round(price * 100) / 100).toFixed(2);
    const val = order.discountValue;
    let productListTotal = 0;
    for(let pl of order.productLists) {
        productListTotal += pl.total;
    }
    const newVal = (productListTotal + order.shipping.shippingPrice) - order.total;
    console.log(order.total, productListTotal, val1, (order.total-productListTotal))
    const price = (Math.round(newVal * 100) / 100).toFixed(2);
    return price
});
class PdfGeneratorService{
    constructor() {}

   async getBase64(filename) {
        return fs.readFileSync(path.join(process.cwd() + '/invoices/' + filename)).toString('base64');
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
            path: path.join(process.cwd() + '/invoices/' + filename)
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
