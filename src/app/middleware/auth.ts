import { NextFunction, Request, Response } from 'express';

import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import jwt, { JwtPayload } from 'jsonwebtoken';
import httpStatus from 'http-status';
import config from '../config';

import AuthError from '../errors/AuthError';
import { TUserRole } from '../modules/auth/auth.interface';
import { User } from '../modules/auth/auth.model';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1] as string;

    if (!token) {
      throw new AuthError(
        httpStatus?.UNAUTHORIZED,
        'You have no access to this route',
      );
    }

    const decode = jwt.verify(
      token as string,
      config.jwt_access_secret as string,
    ) as JwtPayload;

    const { role, userEmail} = decode;

    const user = await User.isUserExistsByEmail(userEmail);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AuthError(
        httpStatus?.UNAUTHORIZED,
        'You have no access to this route',
      );
    }

    req.user = decode as JwtPayload;

    next();
  });
};

export default auth;
