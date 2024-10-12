import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import CsvData from '@/app/api/models/csvdata.model';

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

export async function POST(req) {
  console.log('Received CSV upload request');
  try {
    const body = await req.json();
    const { data } = body;

    if (!data || !Array.isArray(data)) {
      console.log('Invalid data format');
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    await dbConnect();

    // Check if a CSV was uploaded in the last 5 seconds
    const recentUpload = await CsvData.findOne({
      uploadedAt: { $gte: new Date(Date.now() - 5000) }
    });

    if (recentUpload) {
      console.log('Duplicate upload detected');
      return NextResponse.json({ 
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
      rawData: data,
      processedData: processedData,
      uploadedAt: new Date()
    });

    // Save the document to the database
    console.log('Saving CSV data to database');
    await newCsvData.save();

    console.log('CSV data saved successfully');

    return NextResponse.json({ 
      message: 'CSV data uploaded and saved successfully', 
      data: processedData 
    });
  } catch (error) {
    console.error('Error uploading CSV:', error);
    return NextResponse.json({ 
      error: 'An error occurred while uploading and saving the CSV', 
      details: error.message 
    }, { status: 500 });
  }
}
