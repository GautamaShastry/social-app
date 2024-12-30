import Post from "../models/Post.js";

/* CREATE */
export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath} = req.body; // destructure the post from the request body
        const user = await User.findById(userId); // find the user by id
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: []
        }); // create a new post
        await newPost.save(); // save the new post

        const post = await Post.find()
        res.status(201).json(newPost); // return the new post
    } catch(err) {
        res.status(409).json({ message: err.message });
    }
}

/* READ */
export const getFeedPosts = async (req, res) => {
    try {
        const posts = await Post.find(); // find all posts
        res.status(200).json(posts); // return the posts
    } catch(err) {
        res.status(404).json({ message: err.message });
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params; // destructure the userId from the request parameters
        const posts = await Post.find({ userId }); // find all posts by userId
        res.status(200).json(posts); // return the posts
    } catch(err) {
        res.status(404).json({ message: err.message });
    }
}

/* UPDATE */
export const likePost = async (req, res) => {
    try {
        const { id } = req.params; // destructure the id from the request parameters
        const { userId } = req.body; // destructure the userId from the request body
        const post = await Post.findById(id); // find the post by id
        const isLiked = post.likes.get(userId); // get the likes
        if(isLiked) {
            post.likes.delete(userId); // unlike the post
        } else {
            post.likes.set(userId, true); // like the post
        }
        const updatedPost = await Post.findByIdAndUpdate(id, { likes: post.likes }, { new: true }); // update the post
        res.status(200).json(updatedPost); // return the post
    } catch(err) {
        res.status(404).json({ message: err.message });
    }
}