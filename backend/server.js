import 'express-async-errors';
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xssClean from "xss-clean";
import compression from "compression";
import { connectDB } from "./config/db.js";
import { authRouter } from "./routes/authRoutes.js";
import { bookingRouter } from "./routes/bookingRoutes.js";
import { serviceRouter } from "./routes/serviceRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = [process.env.FRONTEND_URL || 'http://localhost:5175'];

// Middleware
app.use(helmet());
app.use(morgan('tiny'));
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(mongoSanitize());
app.use(xssClean());
app.use(compression());

// Prevent caching of API responses
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes.'
});
app.use(limiter);

// Routes
app.use('/api/auth', authRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/services', serviceRouter);

app.get('/', (req, res) => {
  res.send('ServiceTrip Backend is Running 🚀');
});

setInterval(() => {
  fetch(process.env.BACKEND_URL)
    .then(() => console.log('Keep-alive ping successful'))
    .catch((err) => console.error('Keep-alive failed:', err));
}, 840000);

app.use(errorHandler);

const startServer = async () => {
  await connectDB();
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  server.on('error', (error) => {
    console.error('Server failed to start:', error.message);
    process.exit(1);
  });
};

startServer();