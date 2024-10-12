import { useState, useCallback } from 'react';
import { Button, Typography, CircularProgress } from '@mui/material';
import Papa from 'papaparse';

export default function CSVUpload({ onUpload }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [lastUploadTimestamp, setLastUploadTimestamp] = useState(0);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = useCallback(() => {
    const now = Date.now();
    if (file && !isUploading && now - lastUploadTimestamp > 5000) {
      setIsUploading(true);
      setLastUploadTimestamp(now);
      
      Papa.parse(file, {
        complete: async (result) => {
          try {
            console.log('Sending CSV data to server');
            const response = await fetch('/api/upload-csv', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ data: result.data }),
            });

            if (!response.ok) {
              throw new Error('Failed to upload CSV data');
            }

            const uploadedData = await response.json();
            console.log('CSV upload response:', uploadedData);
            onUpload(uploadedData);
          } catch (error) {
            console.error('Error uploading CSV:', error);
            // Handle error (e.g., show error message to user)
          } finally {
            setIsUploading(false);
            setFile(null); // Reset file after upload
          }
        },
        header: true,
      });
    }
  }, [file, isUploading, lastUploadTimestamp, onUpload]);

  return (
    <div>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="csv-upload"
      />
      <label htmlFor="csv-upload">
        <Button variant="contained" component="span" disabled={isUploading}>
          Choose CSV File
        </Button>
      </label>
      {file && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          Selected file: {file.name}
        </Typography>
      )}
      <Button
        variant="contained"
        onClick={handleUpload}
        disabled={!file || isUploading}
        sx={{ ml: 2 }}
      >
        {isUploading ? <CircularProgress size={24} /> : 'Upload'}
      </Button>
    </div>
  );
}
