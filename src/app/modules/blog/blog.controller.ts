import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BlogService } from './blog.service';
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { User } from '../auth/auth.model';
import { TUserDocument } from '../auth/auth.interface';

const createBlog = catchAsync(async (req: Request, res: Response) => {
  const { userEmail } = req.user;
  const user = (await User.isUserExistsByEmail(
    userEmail,
  )) as TUserDocument | null;
  if (user?.isBlocked) throw new Error('User is blocked');
  let userID: Types.ObjectId;
  if (user) {
    userID = new Types.ObjectId(user?._id);
    const result = await BlogService.createBlogIntoDB(userID, req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Blog created successfully',
      data: result,
    });
  }
});

const updateBlog = catchAsync(async (req, res) => {
  const blogId = new Types.ObjectId(req.params.id);
  const { userEmail } = req.user;
  const blogData = req.body;
  const result = await BlogService.updateBlogIntoDB(
    userEmail,
    blogId,
    blogData,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Blog updated successfully',
    data: result,
  });
});

const getAllBlogs = catchAsync(async (req, res) => {
  const result = await BlogService.getAllBlogsFromDB(req.query);
  sendResponse(res, {
    success: true,
    message: 'Blogs retrieved successfully',
    data: result.result,
    statusCode: httpStatus.OK,
  });
});

const deleteBlog = catchAsync(async (req, res) => {
  const { userEmail } = req.user;
  const blogId = new Types.ObjectId(req.params.id);
  await BlogService.deleteBlogFromDB(userEmail, blogId);
  sendResponse(res, {
    success: true,
    message: 'Blog deleted successfully',
    statusCode: httpStatus.OK,
  });
});

export const deleteBlogByAdmin =  catchAsync(async (req, res)=> {
  const blogId = new Types.ObjectId(req.params.id);
  await BlogService.deleteBlogByAdminFromDB(blogId);

  sendResponse(res, {
    success: true,
    message: 'Blog deleted successfully',
    statusCode: httpStatus.OK,
  });
})

export const BlogController = {
  createBlog,
  getAllBlogs,
  updateBlog,
  deleteBlog,
  deleteBlogByAdmin
};
