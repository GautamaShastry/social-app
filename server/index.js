// Description: Main entry point for the server. This file is responsible for setting up the server, connecting to the database, and defining the routes.   
import express from 'express';
import bodyParser from 'body-parser';  // Parse incoming request bodies in a middleware before your handlers, available under the req.body property
import mongoose from 'mongoose'; // MongoDB object modeling tool designed to work in an asynchronous environment
import cors from 'cors'; // Cross-Origin Resource Sharing
import dotenv from 'dotenv'; // loads environment variables from a .env file into process.env
import morgan from 'morgan'; // HTTP request logger middleware
import path from 'path';
import multer from 'multer'; // middleware for handling multipart/form-data, which is primarily used for uploading files
import helmet from 'helmet'; // secure the app by setting various HTTP headers
import { fileURLToPath } from 'url'; // properly set the path from directories
import { dirname } from 'path'; // properly set the path from directories
import { register } from './controllers/auth.js'; // import the register function from the auth controller
import userRoutes from './routes/users.js'; // import the user routes
import authRoutes from './routes/auth.js'; // import the auth routes   
import postRoutes from './routes/posts.js'; // import the post routes 
import { createPost } from './controllers/posts.js'; // import the createPost function from the posts controller
import { verifyToken } from './middleware/auth.js'; // import the verifyToken function from the auth middleware
import User from './models/User.js'; // import the User model
import Post from './models/Post.js'; // import the Post model

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin'}));
app.use(morgan('common'));
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));

/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/assets');
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

/* ROUTES WITH FILES */
app.post('/auth/register', upload.single('picture'), register);
app.post('/posts', verifyToken, upload.single('picture'), createPost);

/* ROUTES */
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);

/* Mongoose setup */
const CONNECTION_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 6001;
mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port: ${PORT}`);
    });
}).catch((error) => {
    console.log(error.message);
});

