import mongoose from 'mongoose';

const CsvDataSchema = new mongoose.Schema({
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
    firstLinked: { type: Date, default: null }
  }],
  uploadedAt: { type: Date, default: Date.now }
});

// Check if the model already exists to prevent recompilation
const CsvData = mongoose.models.CsvData || mongoose.model('CsvData', CsvDataSchema, 'csvdata');

export default CsvData;
