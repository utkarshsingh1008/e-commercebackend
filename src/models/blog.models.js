import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      
    },
    category: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      
      default: "Admin", 
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
    isdisLiked: {
      type: Boolean,
      default: false,
    },
    numviews: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
    toJSON: { virtuals: true }, // Enables virtuals in JSON output
    toObject: { virtuals: true }, // Enables virtuals in object output
  }
);

// Export the model
const Blog = mongoose.model("Blog", blogSchema);
export default Blog;