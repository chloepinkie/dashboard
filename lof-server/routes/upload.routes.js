const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');

router.post('/upload-csv', uploadController.uploadCSV);

module.exports = router;