import { Types } from 'mongoose';
import Blog from './blog.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { User } from '../auth/auth.model';

const createBlogIntoDB = async (
  userID: Types.ObjectId,
  payload: { title: string; content: string },
) => {
  
  const blogData = { ...payload, author: userID };
  const result = await Blog.create(blogData);
  return result;
};

const getAllBlogsFromDB = async (query: Record<string, unknown>) => {
  const facilityQuery = new QueryBuilder(Blog.find(), query)
    .search(['title', 'content'])
    .filter()
    .sort();

  const result = await facilityQuery.modelQuery.exec();

  return { result };
};

const updateBlogIntoDB = async (
  userEmail: string,
  blogID: Types.ObjectId,
  payload: { title: string; content: string },
) => {
  const user = await User.isUserExistsByEmail(userEmail);
  if (!user) throw new Error('User is not found');

  const blog = await Blog.findById(blogID);
  if (!blog) throw new Error('Blog is not found');
  if (!blog || !blog?.author?.equals(user._id as Types.ObjectId))
    throw new Error('You are not authorized to delete this blog');
  const result = await Blog.findOneAndUpdate({ _id: blogID }, payload, {
    new: true,
  });

  return result;
};

const deleteBlogFromDB = async (userEmail: string, blogId: Types.ObjectId) => {
  const user = await User.isUserExistsByEmail(userEmail);

  if (!user) throw new Error('User is not found');

  const blog = await Blog.findById(blogId);

  if (!blog || !blog?.author?.equals(user._id as Types.ObjectId))
    throw new Error('You are not authorized to delete this blog');

  const result = await Blog.findByIdAndDelete(blogId);
  return result;
};

export const deleteBlogByAdminFromDB = async (blogId: Types.ObjectId) => {
  const blog = await Blog.findById(blogId);

  if (!blog) throw new Error('Blog is not found');

  const result = await Blog.findByIdAndDelete(blogId);
  return result;
};

export const BlogService = {
  createBlogIntoDB,
  getAllBlogsFromDB,
  updateBlogIntoDB,
  deleteBlogFromDB,
  deleteBlogByAdminFromDB,
};
