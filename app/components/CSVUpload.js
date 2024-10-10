import { useState } from 'react';
import { Button, Typography } from '@mui/material';
import Papa from 'papaparse';

export default function CSVUpload({ onUpload }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          onUpload(result.data);
        },
        header: true,
      });
    }
  };

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
        <Button variant="contained" component="span">
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
        disabled={!file}
        sx={{ ml: 2 }}
      >
        Upload
      </Button>
    </div>
  );
}