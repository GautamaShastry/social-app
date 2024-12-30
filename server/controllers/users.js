import User from "../models/User.js"; // import the User model  

/* READ */
export const getUsers = async (req, res) => {
    const { id } = req.params; // destructure the id from the request parameters
    try {
        const user = await User.findById(id); // find the user by id
        res.status(200).json(user); // return the user
    } catch(err) {
        res.status(404).json({ message: "User not found" });
    }
}

export const getUserFriends = async (req, res) => {
    const { id } = req.params; // destructure the id from the request parameters
    try {
        const user = await User.findById(id); // find the user by id
        const friends = await Promise.all(
            user.friends.map((friendId) => {
                return User.findById(friendId); // find the user's friends
    }));
        res.status(200).json(user.friends); // return the user's friends
    } catch(err) {
        res.status(404).json({ message: "User not found" });
    }
}

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
    const { id, friendId } = req.params; // destructure the id and friendId from the request parameters
    try {
        const user = await User.findById(id); // find the user by id
        const friend = await User.findById(friendId); // find the friend by id
        if(user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId); // remove the friend
            friend.friends = friend.friends.filter((id) => id !== id); // remove the user
        } else {
            user.friends.push(friendId); // add the friend
            friend.friends.push(id); // add the user
        }
        await user.save(); // save the user
        await friend.save(); // save the friend

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id)) // find the user's friends
        );

        const formattedFriends = friends.map(
            ({_id, firstName, lastName, occupation, location, picturePath}) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            } // format the friends
        )
        res.status(200).json(formattedFriends); // return the user's friends
    } catch(err) {
        res.status(404).json({ message: err.message });
    }
}