import catchAsync from '../../utils/catchAsync';
import { AuthServices } from './auth.service';
import { TUser } from './auth.interface';
import sendResponse, { sendResponseForToken } from '../../utils/sendResponse';
import httpStatus from 'http-status';
import config from '../../config';
import { User } from './auth.model';


const createUser = catchAsync(async (req, res) => {
  const userDate: TUser = req.body;

  const result = await AuthServices.createUserIntoDB(userDate);

  if (result?.password) {
    result.password = '';
  }

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User registered successfully!',
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUserIntoDB(req.body);

  const { refreshToken, accessToken } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
  });

  const userData = await User.findOne({ email: req?.body?.email }, '-__v');


  if (!userData) throw new Error('User not found');
  const plainUserData = userData.toObject();

  sendResponseForToken(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully',
    data: {
      token: accessToken,
      ...plainUserData,
    },
  });
});

const blockUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  AuthServices.blockUserFromDB(userId);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User blocked successfully!',
  });
});


// const loginUser = catchAsync(async (req, res) => {
//   const { email, password } = req.body;

//   // Login user and retrieve tokens
//   const result = await AuthServices.loginUserIntoDB({ email, password });

//   const { refreshToken, accessToken } = result;

//   // Store refreshToken in cookies
//   res.cookie('refreshToken', refreshToken, {
//     secure: config.node_env === 'production',
//     httpOnly: true,
//   });

//   // Find user by email
//   const userData = await User.findOne({ email }, '-__v');

//   if (!userData) {
//     return res.status(httpStatus.UNAUTHORIZED).json({
//       success: false,
//       message: 'User not found',
//     });
//   }

//   // Safely convert to plain object
//   const plainUserData = userData.toObject();

//   // Check if accessToken is expired
//   try {
//     jwt.verify(accessToken, config.jwt_access_secret as string); // If token is valid, no action needed
//   } catch (error : unknown) {
//     if (error?.name === 'TokenExpiredError') {
//       // Access token expired, generate a new one using refreshToken
//       const newAccessToken = await AuthServices.refreshAccessToken(refreshToken);

//       if (!newAccessToken) {
//         return res.status(httpStatus.UNAUTHORIZED).json({
//           success: false,
//           message: 'Refresh token is invalid or expired',
//         });
//       }

//       sendResponseForToken(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'Access token refreshed successfully',
//         data: {
//           token: newAccessToken,
//           ...plainUserData,
//         },
//       });

//       return; // No need to continue execution
//     }

//     // If error is not due to expiration, throw it
//     throw error;
//   }

//   // Combine token and user data into the response
//   sendResponseForToken(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'User logged in successfully',
//     data: {
//       token: accessToken,
//       ...plainUserData,
//     },
//   });
// });

export const AuthControllers = {
  createUser,
  loginUser,
  blockUser,
};
