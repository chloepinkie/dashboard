import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req) {
  try {
    const data = await req.json();
    const client = await clientPromise;
    const db = client.db();
    const csvCollection = db.collection('csvData');

    // Generate a unique filename
    const filename = `csv_${Date.now()}.csv`;
    
    // Define the path where the CSV will be stored
    const csvFolderPath = path.join(process.cwd(), 'uploads', 'csv');
    const filePath = path.join(csvFolderPath, filename);

    // Ensure the directory exists
    await fs.mkdir(csvFolderPath, { recursive: true });

    // Convert JSON data back to CSV format
    const csvContent = convertJSONtoCSV(data);

    // Write the CSV file
    await fs.writeFile(filePath, csvContent);

    // Store the CSV data and file information in MongoDB
    await csvCollection.insertOne({
      data: data,
      filename: filename,
      filePath: filePath,
      uploadedAt: new Date()
    });

    return NextResponse.json({ message: 'CSV data uploaded and saved successfully' });
  } catch (error) {
    console.error('Error uploading CSV data:', error);
    return NextResponse.json({ error: 'Failed to upload CSV data' }, { status: 500 });
  }
}

function convertJSONtoCSV(jsonData) {
  if (jsonData.length === 0) return '';

  const headers = Object.keys(jsonData[0]).join(',');
  const rows = jsonData.map(row => 
    Object.values(row).map(value => 
      typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
    ).join(',')
  );

  return [headers, ...rows].join('\n');
}