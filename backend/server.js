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

//Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add this BEFORE the 404 handler (around line 68)
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

// Keep your 404 handler below this
app.use((req, res) => {
    res.status(404).json({ success: false, error: "Route not found", statuscode: 404 });
});
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// static folder for uploads (only if directory exists, for serverless compatibility)
try {
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
} catch (error) {
    console.warn('Uploads directory not available:', error.message);
}

//Routes
app.use('/api/auth', authRoutes)
app.use('/api/documents', documentRoutes)
app.use('/api/flashcards', flashcardRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/quizzes', quizRoutes)
app.use('/api/progress', progressRoutes)


app.use(errorHandler);


//404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, error: "Route not found", statuscode: 404 });
});

// Export the app for Vercel serverless functions
export default app;

// Start server locally (only when not on Vercel)
// Vercel sets the VERCEL environment variable, so we skip app.listen() on Vercel
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

