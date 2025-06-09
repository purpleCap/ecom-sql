import { Request, Response, NextFunction} from 'express';
import { BadRequestError } from '../errors/bad-request-error';
import { Blog, BlogModel } from '../util/database/model/blog';
import { SuccessResponse } from '../model/success';
import { User } from '../util/database/model/user';

const createBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.currentUser?.userId;
        const role = req.currentUser?.role;

        if(role !== 'admin' || !userId) {
            throw new BadRequestError("You are not allowed to create blogs");
        }

        const { title, description, category } = req.body;


        const blog = await Blog.create({createdBy: userId, title, description, category});

        res.status(201).json(new SuccessResponse({statusCode: 201, message: "new blog post", data: blog}));
    } catch(err) {
        next(err);
    }
}

const updateBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.currentUser?.userId;
        const role = req.currentUser?.role;
        const blogId = req.params.id
        const { title, description, category } = req.body;

        if(role !== 'admin' || !userId) {
            throw new BadRequestError("You are not allowed");
        }

        const fetchedBlog = await Blog.findByPk(blogId);
        if(!fetchedBlog) {
            throw new BadRequestError("Blog id not present in database");
        }
        if(userId != fetchedBlog.createdBy) {
            throw new BadRequestError("You are not allowed to make changes");
        }

        fetchedBlog!.title = title;
        fetchedBlog!.description = description;
        fetchedBlog!.category = category;

        await fetchedBlog.save();

        res.status(200).json(new SuccessResponse({statusCode: 200, message: "blog updated", data: fetchedBlog}));
    } catch(err) {
        next(err);
    }
}

const getBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const blogId = req.params.id;
        if(!blogId) {
            throw new BadRequestError("Please provide required information!");
        }

        const fetchedBlog = await Blog.findByPk(blogId);
        if(!fetchedBlog) {
            throw new BadRequestError("Blog id not present in database");
        }

        res.status(200).json(new SuccessResponse({statusCode: 200, message: "Blog", data: fetchedBlog}));
    } catch(err) {
        next(err);
    }
}

const deleteBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const blogId = req.params.id;
        const userId = req.currentUser?.userId;

        if(!blogId) {
            throw new BadRequestError("Please provide required information!");
        }

        const blog = await Blog.findByPk(blogId);
        if(!blog) {
            throw new BadRequestError("No blog found");
        }
        if(blog?.createdBy !== userId) {
            throw new BadRequestError("Blogs are only permitted to change or delete by the user who created it.");
        }

        res.status(200).json(new SuccessResponse({statusCode: 200, message: "Blog deleted"}));
    } catch(err) {
        next(err);
    }
}

const likeDislikeBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const blogId = req.params.id;
        const userId = req.currentUser?.userId;
        const action = req.query.action;
        let hasLiked = false;
        let hasDisliked = false;

        if(!blogId) {
            throw new BadRequestError("Please provide required information!");
        }

        const blog = await Blog.findByPk(blogId, {
            include: ['likedUsers', 'dislikedUsers'],
        });

        const fetchedUser = await User.findByPk(userId);
        if(!fetchedUser) {
            throw new BadRequestError("user does not exist")
        }

        const likedblogs = await fetchedUser!.getLikedBlogs();
        const dislikedblogs = await fetchedUser!.getDislikedBlogs();
        console.log(likedblogs)
        const foundLikedBlog = likedblogs.find((b: BlogModel) => b.dataValues.blogId === blog?.blogId);
        const foundDislikedBlog = dislikedblogs.find((b: BlogModel) => b.dataValues.blogId === blog?.blogId);
        if(foundLikedBlog) {
            hasLiked = true
        }
        if(foundDislikedBlog) {
            hasDisliked = true
        }
        console.log(foundLikedBlog, foundDislikedBlog)
        if(!blog) {
            throw new BadRequestError("No blog found");
        }

        console.log(action)
        if(action === 'like') {
            if(hasLiked) {
                await blog.removeLikedUser(fetchedUser);
            } else {
                await blog.addLikedUser(fetchedUser);
                await blog.removeDislikedUser(fetchedUser);
            }
        }

        if(action === 'dislike') {
            if(hasDisliked) {
                await blog.removeDislikedUser(fetchedUser);
            } else {
                await blog.addDislikedUser(fetchedUser);
                await blog.removeLikedUser(fetchedUser);
            }
        }

        res.status(200).json(new SuccessResponse({statusCode: 200, message: "Blog FETCHED"}));
    } catch(err) {
        console.log(err);
        next(err);
    }
}

const blogController = { createBlog, updateBlog, getBlog, deleteBlog, likeDislikeBlog };
export default blogController;