import Blog from "../models/blog.models.js";
import expressAsyncHandler from "express-async-handler";
import { ApiError } from "../utils/ApiError.js";
const createBlog = expressAsyncHandler(async (req, res) => {
    try{
       const blog = await Blog.create(req.body);
       console.log(blog);
       res.status(200).json({
           blog,
           message: "Blog created successfully"
       })
    } catch(error){
     throw  new ApiError(500, error.message || "Failed to create blog");
    }
})
const updateBlog = expressAsyncHandler(async (req, res) => {
    try{
        const updateBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.status(200).json({
            updateBlog,
            message: "Blog updated successfully"
        })
    }catch(error){
        throw new ApiError(500, error.message || "Failed to update blog");
    }
})
const getBlog = expressAsyncHandler(async (req, res) => {
    try{
        const getBlog = await Blog.findById(req.params.id);
        if(!getBlog){
           throw new ApiError(404, "Blog not found"); 
        }
        res.status(200).json({
            getBlog,
            message: " find blog successfully"
        })
    }catch(error){
        throw new ApiError(500, error.message || "Failed to get blog");
    }
})
const deleteBlog = expressAsyncHandler(async (req, res) => {
    try{
        const deleteBlog= await Blog.findByIdAndDelete(req.params.id);
        res.status(200).json({
            deleteBlog,
            message: "delete successfully"
        })
    }
    catch(err){
        throw new ApiError(500, err.message || "Failed to get all blogs");
    }
})
const getAllBlogs = expressAsyncHandler(async (req, res) => {
    try{
        const getAllBlogs = await Blog.find();
        res.status(200).json({
            getAllBlogs,
            message: "Get all blogs successfully"
        })
    }
    catch(err){
        throw new ApiError(500, err.message || "Failed to get all blogs");
    }
})

const likeBlog = expressAsyncHandler(async (req, res) => {
    const { blogID } = req.body;
    try {
        let blog = await Blog.findById(blogID);
        const loginUserId = req?.user?._id;

        if (!blog) {
            throw new ApiError(404, "Blog not found");
        }

        const isLiked = blog?.isLiked;
        const alreadyDisliked = blog?.dislikes?.some(
            (userId) => userId.toString() === loginUserId.toString()
        );

        if (alreadyDisliked) {
            blog = await Blog.findByIdAndUpdate(
                blogID,
                { 
                    $pull: { dislikes: loginUserId }, 
                    isDisliked: false 
                },
                { new: true }
            );
        }

        if (isLiked) {
            blog = await Blog.findByIdAndUpdate(
                blogID,
                { 
                    $pull: { likes: loginUserId }, 
                    isLiked: false 
                },
                { new: true }
            );
        } else {
            blog = await Blog.findByIdAndUpdate(
                blogID,
                { 
                    $push: { likes: loginUserId }, 
                    isLiked: true 
                },
                { new: true }
            );
        }

        return res.json(blog);
    } catch (error) {
        throw new ApiError(500, error.message || "Failed to like blog");
    }
});

export {createBlog, updateBlog, getBlog, deleteBlog, getAllBlogs, likeBlog};