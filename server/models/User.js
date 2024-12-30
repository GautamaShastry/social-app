// we define the schema of the user model here
import { mongoose } from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min: 3,
        max: 50
    },
    lastName: {
        type: String,
        required: true,
        min: 3,
        max: 50
    },
    email: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 5
    },
    picturePath: {
        type: String,
        default: ''
    },
    friends: {
        type: Array,
        default: []
    },
    location: {
        type: String,
        default: ''
    },
    occupation: String,
    viewedProfile: Number,
    impressions: Number
},
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;