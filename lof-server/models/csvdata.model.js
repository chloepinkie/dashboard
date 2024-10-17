const mongoose = require('mongoose');

const CsvDataSchema = new mongoose.Schema({
  fileName: { type: String, required: true, index: true },
  date: { type: String, required: true, index: true },
  rawData: [mongoose.Schema.Types.Mixed],
  processedData: [{
    name: { type: String, default: '' },
    username: { type: String, default: '' },
    instagram: { type: String, default: '' },
    mentions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    orderCount: { type: Number, default: 0 },
    orderVolume: { type: Number, default: 0 },
    commissionsEarned: { type: Number, default: 0 },
    estimatedMediaValue: { type: Number, default: 0 },
    firstLinked: { type: Date, default: '' },
    User_id: { type: Number, default: 0 },
    User_image: { type: String, default: '' },
    social_links: { type: String, default: '' },
    isPro: { type: Number, default: 0 },
    socials_linked: [String]
  }],
  uploadedAt: { type: Date, default: Date.now }
});

const CsvData = mongoose.model('CsvData', CsvDataSchema, 'csvdata');

module.exports = CsvData;
