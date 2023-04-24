import { UserController } from '../controllers/user.controller.js';

// routes responsible for user and blog management
export const userRoutes = (app) => {
  app
    .route('/blogs')
    .get(UserController.getUserBlogs);
};
