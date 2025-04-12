const { S3Client} = require("@aws-sdk/client-s3");
require("dotenv").config();

const s3 = new S3Client({
  region: process.env.AWS_REGION , // Your AWS region
  credentials : { 
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Your AWS access key ID
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Your AWS secret access key
  }
});

exports.s3 = s3; // Export the S3 client for use in other files