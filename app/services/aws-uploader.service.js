import * as AWS from 'aws-sdk';
import path from "path";
import fs from 'fs'
class AwsUploaderService{
 constructor() {
  this.s3 = new AWS.S3({
   accessKeyId: process.env.AWS_ID,
   secretAccessKey: process.env.AWS_SECRET,
  });
 }
 async getInvoiceNumber() {
     this.s3 = new AWS.S3({
         accessKeyId: process.env.AWS_ID,
         secretAccessKey: process.env.AWS_SECRET,
     });
  console.log(process.env.AWS_ID, process.env.AWS_SECRET)
  return new Promise(async (resolve, reject) => {
   const params = {
    Bucket: process.env.ENV === 'PROD' ? process.env.AWS_BUCKET_NAME_PROD: process.env.AWS_BUCKET_NAME_DEV,
   }
   console.log(params);
   this.s3.listObjectsV2(params,(err, data) => {
    if (err) {
     reject(err);
    } else {
     const invoiceNumber = data.KeyCount + 1;
     resolve('fs/' + invoiceNumber + '/2020');
    }
   })
  });

 }
 async uploadFile(filename) {
  return new Promise(async (resolve, reject) => {
   const file = await fs.readFileSync(path.join(process.cwd() + '/invoices/' + filename))
   console.log(file);
   const params = {
    Bucket: process.env.ENV === 'PROD' ? process.env.AWS_BUCKET_NAME_PROD : process.env.AWS_BUCKET_NAME_DEV,
    ContentType: 'application/pdf',
    Key: filename, // File name you want to save as in S3
    Body: file,
   };
   this.s3.upload(params, (err, data) => {
    if (err) {
     reject(err);
     throw err;
    }
    console.log(data.Location);
    resolve(data.Location);
   });
  });
 }
}
const awsUploader = new AwsUploaderService();
export default awsUploader;
