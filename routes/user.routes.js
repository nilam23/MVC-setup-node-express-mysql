import { UserController } from '../controllers/user.controller.js';
import { AuthMiddlewares } from '../middlewares/auth.middleware.js';

// routes responsible for user and blog management
export const userRoutes = (app) => {
  app
    .route('/blogs')
    .get(UserController.getAllBlogs)
    .post(AuthMiddlewares.checkAuth, UserController.createBlog);
};
