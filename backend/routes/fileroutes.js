const {getUploadUrl, getDownloadUrl} = require("../controllers/get.controller");
const express = require("express");
const router = express.Router();


router.route("/upload").get(getUploadUrl); // Route to get upload URL
router.route("/download/:fileName").get(getDownloadUrl); // Route to get download URL

module.exports = router;