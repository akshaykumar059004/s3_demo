const { S3Client, ListObjectsV2Command, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const express = require("express");
const router = express.Router();
require("dotenv").config();

const s3 = new S3Client(); // Add credentials and region

  router.get("/upload", async (req, res) => {
  const Bucket = '';
  const Key ='farmpond4.pdf';
  const Expires = 90; // URL valid for 60 seconds
  const ContentType = 'application/pdf'; // Set the content type to PDF

  const command = new PutObjectCommand({Bucket, Key, ContentType});
  try {
    const uploadURL = await getSignedUrl(s3,command, {Expires});
    console.log('Upload URL (Server):', uploadURL);
    res.json(uploadURL);
   
  } catch (error) {
    console.error('Error generating presigned URL', error);
    //res.status(500).send('Error generating presigned URL');
    throw error;
  }
});

router.get("/download/:fileName", async (req, res) => {
  const { fileName } = req.params;
  const Bucket = '';
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

module.exports = router;