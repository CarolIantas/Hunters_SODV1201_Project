const jwt = require("jsonwebtoken");
const users = require("../data/users.json");

const verifyToken = (req, res, next) => {        
    const authHeader = req.headers.authorization;     

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT);
        const email = decoded.email;
        const user = users.filter(f => f.email === email);

        console.log(users)
        console.log("email", email)

        if (user.length > 0) {
            req.user = user[0];
        } else {
            return res.status(404).json({ error: "User token not found" });
        }

        next();
    } catch (e) {
        return res.status(401).json({ error: "Invalid token" });
    }
};

module.exports = verifyToken;