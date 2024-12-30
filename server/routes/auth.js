// all the routes related to authentication are defined here
import express from 'express';
import { login } from '../controllers/auth.js'; // import the login function from the auth controller

const router = express.Router();

router.post('/login', login); // define the login route

export default router;