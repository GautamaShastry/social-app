// Desc: Controller for user authentication

import bcrypt from "bcrypt"; // allows us to hash passwords
import jwt from "jsonwebtoken"; // allows us to create and verify tokens(for authorization)

import User from "../models/User.js"; // import the User model

/* REGISTER THE USER */
export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, picturePath, friends, location, occupation } = req.body; // destructure the request body

        const userExists = await User.findOne({ email }); // check if the user exists
        if(userExists) return res.status(400).json({ message: "User already exists" }); // if the user exists, return an error

        const salt =  await bcrypt.genSalt(); // generate a salt
        const hashedPassword = await bcrypt.hash(password, salt); // hash the password

        const newUser = new User({ 
            firstName, 
            lastName, 
            email, 
            password: hashedPassword, 
            picturePath, 
            friends, 
            location, 
            occupation,
            viewedProfile: Math.floor(Math.random() * 1000),
            impressions: Math.floor(Math.random() * 1000)
        }); // create a new user
        const savedUser = await newUser.save(); // save the user to the database
        res.status(201).json(savedUser); // return the saved user
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }   
}

/* LOGIN THE USER */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body; // destructure the request body

        const user = await User.findOne({ email }); // find the user by email
        if(!user) return res.status(404).json({ message: "User not found" }); // if the user is not found, return an error

        const validPassword = await bcrypt.compare(password, user.password); // compare the password
        if(!validPassword) return res.status(400).json({ message: "Invalid credentials" }); // if the password is invalid, return an error

        const token = jwt.sign({id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" }); // create a token

        const userWithoutPassword = user.toObject(); // convert the user to an object
        delete userWithoutPassword.password; // delete the password from the user object
        
        res.status(200).json({ token, user: userWithoutPassword }); // return the user and the token
    
    } catch(err) {
        res.status(500).json({ message: "Something went wrong" });
    }
}