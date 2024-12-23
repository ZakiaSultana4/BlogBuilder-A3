import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../../config';
import { TUser, UserModel } from './auth.interface';

// Define the User schema
const userSchema = new Schema<TUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // Ensure email is stored in lowercase
    },
    password: {
      type: String,
      required: true,
      select: 0, // Don't include password in queries by default
    },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'user'],
      default: 'user', // Default role is 'user'
    },
    isBlocked: {
      type: Boolean,
      default: false, // Default is not blocked
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  },
);

// Pre-save hook for password hashing
userSchema.pre('save', async function (next) {
  const user = this as Document & TUser;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_rounds),
    );
  }

  next();
});

// Static method to check if a user exists by email
userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email }).select('+password'); // Include password field
};

// Static method to match passwords
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

// Define the User model
export const User = model<TUser, UserModel>('User', userSchema);
