import express from 'express';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';

import { BlogController } from './blog.controller';
import { BlogValidationSchema } from './blog.validation';

const router = express.Router();

router.post(
  '/',
  auth('user'),
  validateRequest(BlogValidationSchema.createblogValidationSchema),
  BlogController.createBlog,
);
router.patch(
  '/:id',
  auth('user'),
  validateRequest(BlogValidationSchema.updateblogValidationSchema),
  BlogController.updateBlog,
);
router.delete('/:id', auth('user'), BlogController.deleteBlog);
router.get('/', BlogController.getAllBlogs);

export const BlogRoutes = router;
