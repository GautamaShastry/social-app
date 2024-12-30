import jwt from "jsonwebtoken"; // allows us to create and verify tokens(for authorization)

// verify the token
export const verifyToken = (req, res, next) => {
    try{

        let token  = req.header("Authorization");

        if(!token) return res.status(403).send("Access Denied"); // if there is no token, return an error
        // if the token starts with "Bearer ", remove it
        if(token.startsWith("Bearer ")){
            token = token.slice(7, token.length).trimLeft();
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET); // verify the token
        req.user = verified; // set the user to the verified token

    } catch(err) {
        res.status(401).json({ message: "Unauthorized" });
    }
}
