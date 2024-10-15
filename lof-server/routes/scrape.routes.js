const express = require('express');
const router = express.Router();
const scrapeController = require('../controllers/scrape.controller');

router.post('/shopmy', scrapeController.scrapeShopmyAndSave2Db);
router.post('/shopmy/all', scrapeController.scrapeShopmyAndSave2DbAll);

module.exports = router;
