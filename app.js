import express from 'express';
import {} from 'dotenv/config.js';
import { userRoutes } from './routes/user.routes.js';
import { STATUS_CODES } from './helpers/constants.js';
import { sendResponse } from './helpers/utils.js';
import { authRoutes } from './routes/auth.routes.js';

const app = express();

// middlewares
app.use(express.json());

// routes
authRoutes(app);
userRoutes(app);
app.all('*', (req, res) => sendResponse(res, STATUS_CODES.BAD_REQUEST, `Can't find ${req.method} ${req.originalUrl} on this server!`));

// running the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at ${PORT}`));
