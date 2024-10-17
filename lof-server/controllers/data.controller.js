const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const CsvData = require('../models/csvdata.model');

// Helper function to verify JWT token
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

exports.getDashboardData = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const { startDate, endDate } = req.query;

    console.log('Received date range:', { startDate, endDate });

    // Get the native MongoDB collection
    const collection = mongoose.connection.db.collection('csvdata');

    const csvDataDocs = await collection.find({
      date: {
        $gte: startDate,
        $lte: endDate
      }
    })
    .sort({ date: 1 })
    .project({
      fileName: 1,
      date: 1,
      processedData: 1
    })
    .allowDiskUse(true)
    .toArray()

    console.log(`Retrieved ${csvDataDocs.length} documents`);

    if (csvDataDocs.length === 0) {
      return res.status(404).json({ error: 'No data found for the specified date range' });
    }

    // Combine processedData from all documents
    const filteredData = csvDataDocs

    console.log('Filtered data count:', filteredData.length);
    console.log('Sample filtered data:', filteredData.slice(0, 5));

    res.json(filteredData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'An error occurred while fetching dashboard data', details: error.message });
  }
};

module.exports = {
  getDashboardData: exports.getDashboardData
};
