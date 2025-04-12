const { GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
require("dotenv").config();
const asyncHandler = require("../middlewares/asynHandler");
const { s3 } = require("../config"); // Import the S3 client from config.js


 //get-upload url
 exports.getUploadUrl = asyncHandler(async (req, res) => {
  const Bucket = process.env.AWS_BUCKET_NAME; // Your S3 bucket name
  const Key ='farmpond4.pdf';
  const Expires = 90; // URL valid for 60 seconds
  const ContentType = 'application/pdf'; // Set the content type to PDF

  const command = new PutObjectCommand({Bucket, Key, ContentType});
  try {
    const uploadURL = await getSignedUrl(s3,command, {Expires});
    console.log('Upload URL (Server):', uploadURL);
    //return uploadURL;
    res.json(uploadURL);
   
  } catch (error) {
    console.error('Error generating presigned URL', error);
    //res.status(500).send('Error generating presigned URL');
    throw error;
  }
});

//get-download url
exports.getDownloadUrl = asyncHandler( async (req, res) => {
  const { fileName } = req.params;
  const Bucket = process.env.AWS_BUCKET_NAME; // Your S3 bucket name
  const Key = fileName; //modify this to the file you want to download
  const Expires = 90; // URL valid for 60 seconds

  const command = new GetObjectCommand({ Bucket, Key });
  try {
    const downloadURL = await getSignedUrl(s3, command, { Expires });
    console.log('Download URL (Server):', downloadURL);
    res.json(downloadURL);
  } catch (error) {
    console.error('Error generating presigned URL', error);
    //res.status(500).send('Error generating presigned URL');
    throw error;
  }
});