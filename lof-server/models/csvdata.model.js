const mongoose = require('mongoose');

const CsvDataSchema = new mongoose.Schema({
  fileName: String,
  rawData: [mongoose.Schema.Types.Mixed],
  processedData: [{
    name: String,
    username: String,
    instagram: String,
    mentions: Number,
    clicks: Number,
    orderCount: Number,
    orderVolume: Number,
    commissionsEarned: Number,
    estimatedMediaValue: Number,
    firstLinked: String
  }],
  uploadedAt: { type: Date, default: Date.now }
});

const CsvData = mongoose.model('CsvData', CsvDataSchema, 'csvdata');

module.exports = CsvData;
