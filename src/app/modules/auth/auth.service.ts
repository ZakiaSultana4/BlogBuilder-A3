import AppError from '../../errors/AppError';
import { TLoginUser, TUser } from './auth.interface';
import { User } from './auth.model';
import httpStatus from 'http-status';
import { createToken } from './auth.utils';
import config from '../../config';

const createUserIntoDB = async (payload: TUser) => {
  const userIsExist = await User.findOne({ email: payload?.email });

  if (userIsExist) {
    throw new AppError(400, 'With this email, a user already exists!');
  }

  try {
    const result = await User.create(payload);
    const response = result.toObject({ versionKey: false });

    return response;
  } catch (err: unknown) {
    // Specify error type as 'unknown'
    if (err instanceof Error) {
      // Type guard to check if 'err' is an instance of Error
      throw new Error(err.message);
    }
    throw new Error('An unknown error occurred during user creation');
  }
};

const loginUserIntoDB = async (payload: TLoginUser) => {
  const user = await User.isUserExistsByEmail(payload?.email);

  const isBlocked = user?.isBlocked;

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  if (isBlocked) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is Blocked!');
  }

  const jwtPayload = {
    userEmail: user.email,
    role: user.role,
    // id:user._id
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const blockUserFromDB = async (userID: unknown) => {
  const user = await User.findByIdAndUpdate(
    userID,
    { isBlocked: true },
    { new: true },
  );
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }
};

export const AuthServices = {
  createUserIntoDB,
  loginUserIntoDB,
  blockUserFromDB,
  // refreshAccessToken
};
// const refreshAccessToken = async (refreshToken: string) => {
//   try {
//     // Verify refresh token
//     const decoded = jwt.verify(refreshToken, config.jwt_refresh_secret as string);

//     const user = await User.findById(decoded.id);

//     if (!user) {
//       throw new Error('User not found');
//     }

//     // Generate a new access token
//     const newAccessToken = jwt.sign(
//       { id: user._id, role: user.role },
//       config.jwt_access_secret as string,
//       { expiresIn: config.jwt_access_expires_in }
//     );

//     return newAccessToken;
//   } catch (error) {
//     console.error('Error refreshing access token:', error?.message);
//     return null;
//   }
// };
