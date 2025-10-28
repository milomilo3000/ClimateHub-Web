require('dotenv').config();
const express = require('express');
const cors = require('cors');
const chatbotRouter = require('./routes/chatbot');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5001;

const allowedOrigins = [
  'http://localhost:3000',              // Local dev
  'http://localhost:5001',              // Proxy requests
  process.env.FRONTEND_URL,
  'https://climatehub-frontend.onrender.com', // Render/Netlify
  'https://climatehub.sg',              // Main domain
  'https://api.climatehub.sg'           // Subdomain / API domain
];

// Normalize origins once for comparison (strip trailing slashes, drop falsy envs)
const normalizedAllowedOrigins = allowedOrigins
  .filter(Boolean)
  .map(o => o.replace(/\/$/, ''));

console.log("🟢 ClimateHub backend booting");
console.log("🔑 OPENAI_API_KEY present?", !!process.env.OPENAI_API_KEY);
console.log("🌐 Allowed origins:", allowedOrigins);
console.log("🪵 Server logging active...");

app.use(cors({
  origin: function(origin, callback) {
    console.log("🛰 Incoming request Origin:", origin);

    // Allow same-origin / server-to-server / curl / Postman (no Origin header)
    if (!origin) {
      console.log("✅ No origin header (server-to-server or curl) -> allowed");
      return callback(null, true);
    }

    // strip trailing slash for comparison
    const cleanOrigin = origin.replace(/\/$/, '');
    const isAllowed = normalizedAllowedOrigins.includes(cleanOrigin);

    if (isAllowed) {
      console.log("✅ Origin allowed:", cleanOrigin);
      return callback(null, true);
    }

    console.warn("🚫 CORS blocked origin:", cleanOrigin);
    console.warn("🔎 Allowed origins are:", normalizedAllowedOrigins);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 200
}));

app.use((req, res, next) => {
  const origin = req.headers.origin;
  const cleanOrigin = origin ? origin.replace(/\/$/, '') : null;
  const isAllowed = !cleanOrigin || normalizedAllowedOrigins.includes(cleanOrigin);

  console.log(`➡ ${req.method} ${req.originalUrl} from ${origin || 'no-origin'}`);

  if (isAllowed) {
    res.header('Access-Control-Allow-Origin', origin || 'http://localhost:3000');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  } else {
    console.warn("❗ Request origin not in whitelist during header injection:", cleanOrigin);
  }

  // If browser is doing a preflight check, answer it here with 200
  if (req.method === 'OPTIONS') {
    console.log("🕊 Responding early to preflight OPTIONS");
    return res.status(200).end();
  }

  next();
});

app.options('*', cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/climatehub', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  console.log('Current URI:', process.env.MONGODB_URI ? 'Found in env' : 'Using default');
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/carbon', require('./routes/carbon'));
app.use('/api/news', require('./routes/news'));
app.use('/api/events', require('./routes/events'));
app.use('/api/chatbot', chatbotRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'ClimateHub Backend is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    headers: req.headers
  });
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`ClimateHub Backend running on port ${PORT}`);
});

module.exports = app;