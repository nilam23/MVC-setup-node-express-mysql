import { AuthController } from '../controllers/auth.controller.js';

// routes responsible for auth management
export const authRoutes = (app) => {
  app
    .route('/signup')
    .post(AuthController.signUpUser);
};