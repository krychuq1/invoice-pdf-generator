import pdfGeneratorService from './services/pdf-generator.service';
import awsUploader from './services/aws-uploader.service'
require('dotenv').config()
const axios = require('axios').default;
class Index{
    constructor() {
        // token = '';
        this.init();
    }
    async init() {
        await this.getToken();
        console.log('token received ');
        const res = await this.getOrders();
        for (let [i, o] of res.data.entries()) {
            const invoiceNr = 'FS/' + (i + 1) + '/2020';
            const filename = 'invoice_' + o.createdAt.slice(0, 10) + '_' +
            o.billingAddress.name + '_' + o.billingAddress.surname + '.pdf'
            await pdfGeneratorService.generatePdf(o, filename, invoiceNr);
            // await awsUploader.uploadFile(filename);
        }
        // await pdfGeneratorService.generatePdf(res.data[0], filename);

        // console.log('order received');
        // pdfGeneratorService.generatePdf(res.data[0]);
        // awsUploader.uploadFile();

    }
    async getToken() {
        try {
            const res = await axios.post(process.env.backend_url_local + 'auth/login', {
                username: process.env.admin_login,
                password: process.env.admin_pw_prod
            });
            this.token = res.data.access_token;
        } catch (e) {
            return e;
        }
    }
    async getOrders() {
        const startDate = '2020-09-16'
        const endDate = '2020-09-30 22:00:00'
        const config = {
            headers: { Authorization: `Bearer ${this.token}` }
        };
        try{
            return  await axios.get(process.env.backend_url_local + 'orders/' + startDate + '/' + endDate, config);
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
