const express = require('express');
const router = express.Router();
const dataController = require('../controllers/data.controller');

router.get('/dashboard-data', dataController.getDashboardData);

module.exports = router;