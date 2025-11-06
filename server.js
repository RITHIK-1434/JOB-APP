const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables FIRST
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // Allow all Vercel preview and production URLs
    const allowedOrigins = [
      'http://localhost:3001',
      'http://localhost:3000',
      /\.vercel\.app$/  // This allows ALL Vercel domains
    ];
    
    // Check if origin matches any allowed pattern
    const isAllowed = allowedOrigins.some(pattern => {
      if (pattern instanceof RegExp) {
        return pattern.test(origin);
      }
      return pattern === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Check which database we're connecting to
const mongoURI = process.env.MONGO_URI;
console.log('\n📊 DATABASE CONFIGURATION:');
if (mongoURI && mongoURI.includes('mongodb+srv')) {
  console.log('🌍 Type: MongoDB Atlas (CLOUD DATABASE)');
  console.log('✅ Your friend WILL see your posted jobs!');
  console.log('📍 Cluster: ' + mongoURI.match(/@(.+?)\//)?.[1] || 'Unknown');
} else if (mongoURI && mongoURI.includes('localhost')) {
  console.log('💻 Type: Local MongoDB');
  console.log('❌ Your friend will NOT see your jobs (local only)');
} else {
  console.log('⚠️  Warning: No MONGO_URI found in .env file!');
}
console.log('');

// MongoDB Connection
mongoose.connect(mongoURI || 'mongodb://localhost:27017/job-portal', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Successfully Connected to MongoDB');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  console.log('\n💡 TIP: Check your .env file and MongoDB Atlas credentials\n');
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));

// Basic route for testing
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend is working!',
    database: mongoURI && mongoURI.includes('mongodb+srv') ? 'Cloud (Atlas)' : 'Local'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
});
