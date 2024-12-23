import { Document, Types } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  content: string;
  author?: Types.ObjectId;
  isPublished: boolean;
}
