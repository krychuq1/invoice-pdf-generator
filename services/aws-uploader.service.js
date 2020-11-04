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
 async uploadFile(filename) {
  return new Promise(async (resolve, reject) => {
   const file = await fs.readFileSync(path.join(process.cwd() + '\\invoice.pdf'))
   console.log(file);
   const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
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
