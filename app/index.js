require('dotenv').config()
import pdfGeneratorService from './services/pdf-generator.service';
import awsUploader from './services/aws-uploader.service'
import express from 'express';
import bodyParser from 'body-parser'



const axios = require('axios').default;
class Index{
    constructor() {
        // this.init();
        this.app = express();
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        this.app.use(bodyParser.json());
        this.app.listen(process.env.PORT);
        this.app.post('/generate-invoice',  async (req, res) => {
            console.log('going to generate file', req.body);
            try{
                // get invoice number
                const invoiceNumber = await awsUploader.getInvoiceNumber();
                console.log(req.body.createdAt)
                const filename = 'invoice_' + req.body.createdAt.slice(0, 19).replace(/:/g, '-') + '_' +
                    req.body.billingAddress.name + '_' + req.body.billingAddress.surname + '.pdf'
                await pdfGeneratorService.generatePdf(req.body, filename, invoiceNumber);
                awsUploader.uploadFile(filename);
                res.send(await pdfGeneratorService.getBase64(filename));

            } catch (e) {
                console.log(e);
                res.status(400).send({e: 'error'})
            }

        })
    }
    async init() {
        // const invoiceNumber = await awsUploader.getInvoiceNumber();
        // console.log(invoiceNumber);
        await this.getToken();
        console.log('token received ');
        const res = await this.getOrders();
        console.log(res);
        console.log(res.data.length);
        for (let [i, o] of res.data.entries()) {
            console.log(o.billingAddress.name + '_' + o.billingAddress.surname + (i +1));
            const invoiceNr = 'FS/' + (i + 226) + '/2021';
            const filename = 'invoice_' + o.createdAt.slice(0, 10) + '_' +
            o.billingAddress.name + '_' + o.billingAddress.surname + '_' + (i + 1) + '_' + '.pdf'
            // console.log( o.billingAddress.name);
            await pdfGeneratorService.generatePdf(o, filename, invoiceNr);
            // await awsUploader.uploadFile(filename);
        }

    }
    async getToken() {
        try {
            const res = await axios.post(process.env.backend_url_prod + 'auth/login', {
                username: process.env.admin_login,
                password: process.env.admin_pw_prod
            });
            this.token = res.data.access_token;
        } catch (e) {
            return e;
        }
    }
    async getOrders() {
        const startDate = '2021-09-01 00:00:00';
        const endDate = '2021-09-31 23:59:59';
        const config = {
            headers: { Authorization: `Bearer ${this.token}` }
        }

        ;
        try{
            return  await axios.get(process.env.backend_url_prod + 'orders/' + startDate + '/' + endDate, config);
        }catch (e) {
            console.log(e);
        }
    }
}
const pdf = new Index();





// try {
//     (async () => {
//         var dataBinding = {}
//         var templateHtml = fs.readFileSync(path.join(process.cwd(), 'template.html'), 'utf8');
//         var template = handlebars.compile(templateHtml);
//         var finalHtml = encodeURIComponent(template(dataBinding));
//         var options = {
//             format: 'A4',
//             headerTemplate: "<p></p>",
//             footerTemplate: "<p></p>",
//             displayHeaderFooter: false,
//             margin: {
//                 top: "40px",
//                 bottom: "100px"
//             },
//             printBackground: true,
//             path: 'invoice.pdf'
//         }
//
//         const browser = await puppeteer.launch({
//             args: ['--no-sandbox'],
//             headless: true
//         });
//         const page = await browser.newPage();
//         await page.goto(`data:text/html;charset=UTF-8,${finalHtml}`, {
//             waitUntil: 'networkidle0'
//         });
//         await page.pdf(options);
//         await browser.close();
//
//         console.log('Done: invoice.pdf is created!')
//     })();
// } catch (err) {
//     console.log('ERROR:', err);
// }
