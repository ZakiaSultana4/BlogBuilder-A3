import express from 'express';

import { AuthValidationSchema } from './auth.validation';
import { AuthControllers } from './auth.controller';
import { validateRequestForAuth } from '../../middleware/validateRequest';

const router = express.Router();

router.post(
  '/register',
  validateRequestForAuth(AuthValidationSchema.createUserValidationSchema),
  AuthControllers.createUser,
);

router.post(
  '/login',
  validateRequestForAuth(AuthValidationSchema.loginUserValidationSchema),
  AuthControllers.loginUser,
);

export const UserRoutes = router;
