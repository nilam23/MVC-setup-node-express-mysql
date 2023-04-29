import express from 'express';
import cookieParser from 'cookie-parser';
import {} from 'dotenv/config.js';
import { userRoutes } from './routes/user.routes.js';
import { STATUS_CODES } from './helpers/constants.js';
import { authRoutes } from './routes/auth.routes.js';
import { AppError, handleError } from './helpers/error.js';

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());

// routes
authRoutes(app);
userRoutes(app);

app.all('*', (req, _, next) => {
  next(new AppError(`Can't find ${req.method} ${req.originalUrl} on this server!`, STATUS_CODES.NOT_FOUND));
});

// centralized error handling
app.use((err, req, res, _) => {
  handleError(err, req, res, _);
});

// running the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at ${PORT}`));
