import { Model, Types, Document } from 'mongoose';
import { USER_ROLE } from './auth.constant';

export interface TUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  isBlocked: boolean;
}

export interface TUserDocument extends TUser {
  _id: Types.ObjectId;
}

export interface TLoginUser {
  email: string;
  password: string;
}

export interface UserModel extends Model<TUser> {
  // Check if a user exists by email
  isUserExistsByEmail(email: string): Promise<TUser | null>;

  // Compare plain text password with hashed password
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;

  // Check if JWT was issued before the password was last changed
  isJWTIssuedBeforePasswordChanged(): boolean;
}

// Define the TUserRole type based on the keys of USER_ROLE
export type TUserRole = keyof typeof USER_ROLE;
