const CsvData = require('../models/csvdata.model');

function parseDate(dateString) {
  if (!dateString) return null;
  
  // Try parsing as MM/DD/YYYY
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) return date;

  // Try parsing as DD/MM/YYYY
  const parts = dateString.split('/');
  if (parts.length === 3) {
    const newDate = new Date(parts[2], parts[1] - 1, parts[0]);
    if (!isNaN(newDate.getTime())) return newDate;
  }

  // If all parsing attempts fail, return null
  console.warn(`Invalid date: ${dateString}`);
  return null;
}

exports.uploadCSV = async (req, res) => {
  console.log('Received CSV upload request');
  try {
    const { data, fileName } = req.body;

    if (!data || !Array.isArray(data) || !fileName) {
      console.log('Invalid data format or missing filename');
      return res.status(400).json({ error: 'Invalid data format or missing filename' });
    }

    // Check if a file with the same name already exists
    const existingFile = await CsvData.findOne({ fileName: fileName });
    if (existingFile) {
      console.log('File with the same name already exists');
      return res.status(409).json({ error: 'A file with this name already exists.' });
    }

    // Check if a CSV was uploaded in the last 5 seconds
    const recentUpload = await CsvData.findOne({
      uploadedAt: { $gte: new Date(Date.now() - 5000) }
    });

    if (recentUpload) {
      console.log('Duplicate upload detected');
      return res.json({ 
        message: 'CSV data already uploaded recently', 
        data: recentUpload.processedData 
      });
    }

    // Process the CSV data
    console.log('Processing CSV data');
    const processedData = data.map(row => ({
      name: row['Name'] || '',
      username: row['Username'] || '',
      instagram: row['Instagram'] || '',
      mentions: parseInt(row['Mentions']) || 0,
      clicks: parseInt(row['Clicks']) || 0,
      orderCount: parseInt(row['Order Count']) || 0,
      orderVolume: parseFloat(row['Order Volume']) || 0,
      commissionsEarned: parseFloat(row['Commissions Earned']) || 0,
      estimatedMediaValue: parseFloat(row['Estimated Media Value']) || 0,
      firstLinked: parseDate(row['First Linked'])
    }));

    // Create a new CsvData document
    const newCsvData = new CsvData({
      fileName: fileName,
      rawData: data,
      processedData: processedData,
      uploadedAt: new Date()
    });

    // Save the document to the database
    console.log('Saving CSV data to database');
    await newCsvData.save();

    console.log('CSV data saved successfully');

    return res.json({ 
      message: 'CSV data uploaded and saved successfully', 
      data: processedData 
    });
  } catch (error) {
    console.error('Error uploading CSV:', error);
    return res.status(500).json({ 
      error: 'An error occurred while uploading and saving the CSV', 
      details: error.message 
    });
  }
};

module.exports = {
  uploadCSV: exports.uploadCSV
};
