import pdfGeneratorService from './services/pdf-generator.service';
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

        // console.log('order received');
        pdfGeneratorService.generatePdf(res.data[0]);

    }
    async getToken() {
        try {
            const res = await axios.post(process.env.backend_url_local + 'auth/login', {
                username: process.env.admin_login,
                password: process.env.admin_pw_dev
            });
            this.token = res.data.access_token;
        } catch (e) {
            return e;
        }
    }
    async getOrders() {
        const startDate = '2020-11-01'
        const endDate = '2020-11-02 22:00:00'
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
