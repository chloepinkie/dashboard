const express = require('express');
const cors = require('cors');
const dotenvFlow = require('dotenv-flow');
const mongoose = require('mongoose');
const http = require('http');  // Add this line
const authRoutes = require('./routes/auth.routes');
const dataRoutes = require('./routes/data.routes');
const uploadRoutes = require('./routes/upload.routes');
const scrapeRoutes = require('./routes/scrape.routes');

// Load environment variables from .env.local
dotenvFlow.config({
  node_env: process.env.NODE_ENV || 'development',
  default_node_env: 'development'
});

const app = express();
const port = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Set server timeout to 24 hours
server.timeout = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Could not connect to MongoDB:', err));

// Middleware
app.use(cors());
// app.use(express.json());
app.use(express.json({ limit: '50mb' }));  // Increase JSON payload limit
app.use(express.urlencoded({ limit: '50mb', extended: true }));  // Increase URL-encoded payload limit

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the backend!' });
});

// Use auth routes
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/scrape', scrapeRoutes);

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
