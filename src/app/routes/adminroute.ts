import { Router } from 'express';
import { AuthControllers } from '../modules/auth/auth.controller';
import auth from '../middleware/auth';
import { BlogController } from '../modules/blog/blog.controller';


const router = Router();
router.patch('/users/:userId/block', auth('admin'), AuthControllers.blockUser);
router.delete('/blogs/:id', auth('admin'),BlogController.deleteBlogByAdmin);

export const adminRoute = router;
