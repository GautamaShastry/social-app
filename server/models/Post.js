import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        max: 500
    },
    lastName: {
        type: String,
        max: 500
    },
    picturePath: {
        type: String,
        default: ''
    },
    likes: {
        type: Map,
        of: Boolean
    },
    comments: {
        type: Array,
        default: []
    },
    location: String,
    description: String,
    userPicturePath: String
},
    { timestamps: true }
);
const Post =  mongoose.model('Post', postSchema);

export default Post;