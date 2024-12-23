import { Router } from 'express';
const router = Router();
import { UserRoutes } from '../modules/auth/auth.route';
import { BlogRoutes } from '../modules/blog/blog.route';

const moduleRoutes = [
  {
    path: '/auth',
    route: UserRoutes,
  },
  {
    path: '/blogs',
    route: BlogRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
