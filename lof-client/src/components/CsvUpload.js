import { useState, useCallback } from 'react';
import { Button, Typography, CircularProgress } from '@mui/material';
import Papa from 'papaparse';

export default function CSVUpload({ onUpload }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = useCallback(() => {
    if (file && !isUploading) {
      setIsUploading(true);
      
      Papa.parse(file, {
        complete: async (result) => {
          try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/upload/upload-csv`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
              },
              body: JSON.stringify({ 
                data: result.data,
                fileName: file.name
              }),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('CSV upload response:', data);
            onUpload(data, true, data.message || 'CSV uploaded successfully');
          } catch (error) {
            console.error('Error uploading CSV:', error);
            onUpload(null, false, error.message || 'Failed to upload CSV. Please try again.');
          } finally {
            setIsUploading(false);
            setFile(null);
          }
        },
        header: true,
        skipEmptyLines: true,
        error: (error) => {
          console.error('Error parsing CSV:', error);
          onUpload(null, false, 'Failed to parse CSV. Please check the file format.');
          setIsUploading(false);
        },
      });
    }
  }, [file, isUploading, onUpload]);

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
