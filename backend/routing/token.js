const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

const usersFilePath = path.join(__dirname, "../data/users.json");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT);
        const email = decoded.email;

        // Read fresh users.json each time
        const users = JSON.parse(fs.readFileSync(usersFilePath, "utf8"));

        const user = users.find(u => u.email === email);

        console.log(users);
        console.log("email", email);

        if (user) {
            req.user = user;
        } else {
            return res.status(404).json({ error: "User token not found" });
        }

        next();
    } catch (e) {
        return res.status(401).json({ error: "Invalid token" });
    }
};

module.exports = verifyToken;
