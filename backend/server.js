import dotenv from 'dotenv';
dotenv.config();

import express from 'express'
import cors from 'cors';
import path from 'path'
import { fileURLToPath } from 'url';
import connectDB from './config/db.js'
import errorHandler from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js'
import documentRoutes from './routes/documentRoutes.js'
import flashcardRoutes from './routes/flashcardRoutes.js'
import aiRoutes from './routes/aiRoutes.js'
import quizRoutes from './routes/quizRoutes.js'
import progressRoutes from './routes/progressRoutes.js'

//ES6 module __dirname alternative
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// init express app
const app = express();

// Connect to DB (lazy connection for serverless compatibility)
// Only connect when first request comes in, not on module load
let dbConnected = false;
app.use(async (req, res, next) => {
    if (!dbConnected) {
        try {
            await connectDB();
            dbConnected = true;
        } catch (error) {
            console.error('Database connection error:', error);
            return res.status(500).json({
                success: false,
                error: 'Database connection failed. Please check MONGODB_URI environment variable.',
                statuscode: 500
            });
        }
    }
    next();
});

//Middleware - CORS
const allowedOrigins = [
    'https://ai-power-learning-assistant.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(null, true); // For now, allow all (change to false in production)
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

// Handle preflight requests
// app.options('*', cors());
app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.header('Access-Control-Allow-Credentials', 'true');
        return res.status(204).send();
    }
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'AI Power Learning Assistant API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            auth: '/api/auth',
            documents: '/api/documents',
            flashcards: '/api/flashcards',
            ai: '/api/ai',
            quizzes: '/api/quizzes',
            progress: '/api/progress'
        }
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Static folder for uploads (only if directory exists, for serverless compatibility)
try {
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
} catch (error) {
    console.warn('Uploads directory not available:', error.message);
}

// Routes - THESE MUST COME BEFORE 404 HANDLER
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/progress', progressRoutes);

// Error handler middleware
app.use(errorHandler);

// 404 handler - MUST BE LAST
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: "Route not found",
        statuscode: 404
    });
});

// Export the app for Vercel serverless functions
export default app;

// Start server locally (only when not on Vercel)
if (!process.env.VERCEL && !process.env.VERCEL_ENV) {
    // Connect DB immediately for local development
    connectDB().catch(err => {
        console.error('Failed to connect to database:', err.message);
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

    process.on('unhandledRejection', (err) => {
        console.log(`Error: ${err.message}`);
        process.exit(1);
    });
}