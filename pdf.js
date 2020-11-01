require('dotenv').config()
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const handlebars = require("handlebars");
const axios = require('axios').default;
class Pdf{
    constructor() {
        // token = '';
        this.getToken();
    }
    async getToken() {
        try {
            const res = await axios.post(process.env.backend_url_dev + 'auth/login', {
                username: process.env.admin_login,
                password: process.env.admin_pw_dev
            });
            this.token = res.data.access_token;
        } catch (e) {
            console.log(e);
            return e;
        }
    }
    async getOrders() {

    }
}
const pdf = new Pdf();





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
