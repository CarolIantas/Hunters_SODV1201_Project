// SetUp getting the required things for user routing
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const verifyToken = require("./token");
const {readMongo, updateMongo, deleteMongo, createMongo} = require("../data/mongo.js");

// File configuration
const FILENAME = "users.json";
const FILEPATH = path.join(__dirname.replace("routing","data"), FILENAME);

// Helper: read users from file
async function readUsers(filters = {}) {  
  try {
    const users = await readMongo("users",filters); // reads all users
    return(users);
  } catch (err) {
    console.log({ error: 'Failed to read users', message: err.message });
  }
}

// Helper: hashing password
function hashUserPassword(password, salt){
  return crypto.pbkdf2Sync(password, salt, 20, 64, 'sha512')
}

// CREATE - Sign up a new user
//NO JWT VALIDATION FOR CREATING AN USER
// CREATE - Sign up a new user (no JWT validation for creating a user)
router.post('/users', async (req, res) => {
  try {
    const users = await readUsers(); // ✅ wait for data
    const newUser = req.body;
    
    // Optional: Validate required fields
    if (!newUser.password || !newUser.firstName || !newUser.lastName || !newUser.email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check for duplicate Email
    if (users.some(user => user.email === newUser.email)) {
      return res.status(409).json({ message: "User with this Email already exists" });
    }

    // Get max id to add +1
    const sortedProp = users.sort((a, b) => a.user_id - b.user_id); // ✅ fixed typo (b.user_id)
    let maxId = sortedProp[sortedProp.length - 1]?.user_id ?? 0;
    maxId++;

    // Formatting data save to database
    const CleaningAndCreatingData = {
      firstName: newUser.firstName.replace(/[^\w\s]/gi, ''),
      lastName: newUser.lastName.replace(/[^\w\s]/gi, ''),
      salt: crypto.randomBytes(32).toString('hex')
    };

    const hash = hashUserPassword(newUser.password, CleaningAndCreatingData.salt);
    const hashString = hash.toString("base64"); 

    const FormattedUser = {
      user_id: maxId,
      Fullname: `${CleaningAndCreatingData.firstName} ${CleaningAndCreatingData.lastName}`,
      firstName: CleaningAndCreatingData.firstName,
      lastName: CleaningAndCreatingData.lastName,
      email: newUser.email,
      phone: newUser.phone,
      Hashpassword: hashString, 
      role: newUser.role,
      Salt: CleaningAndCreatingData.salt
    };

    const sanitizeUser = {
      user_id: FormattedUser.user_id,
      Fullname: FormattedUser.Fullname,
      email: FormattedUser.email,
      phone: FormattedUser.phone,
      role: FormattedUser.role,
    };
        
    await createMongo("users", FormattedUser); // ✅ ensure we wait for file/db write

    res.status(201).json({ message: "User created", user: sanitizeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create user", message: err.message });
  }
});


// Login - user
router.post('/users/login', async (req, res) => {
  try {    
    
    const { email, password } = req.body || {};
    const users = await readUsers({email: email});
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }        
    
    const storedHash = users[0].Hashpassword; // string from DB
    const providedHash = hashUserPassword(password, users[0].Salt).toString("base64");  
    
    if (users[0].email !== email || storedHash != providedHash) {
      return res.status(404).json({ error: "User not found" });
    }

    // Prepare response user
    const user = {
      user_id: users[0].user_id,
      Fullname: users[0].Fullname,
      email: users[0].email,
      phone: users[0].phone,
      role: users[0].role,
    };    

    // Generate token (fallback if no secret in env)
    const token = jwt.sign(
      user,
      process.env.JWT || crypto.randomBytes(32).toString("hex"),
      { expiresIn: 86400 }
    );    
    
    // Attach token to user object
    user.token = token;
    
    return res.status(201).json({message: "Authorized", user: user});
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Failed to login", message: err.message });
  }
});

// READ - Get all users
router.get('/users', async (req, res) => {
  res.json(await readUsers());
});

// READ - Get a user by ID
router.get('/users/:id', verifyToken, async (req, res) => {
  try {
    const users = await readUsers(); // wait for the async read
    const user = users.find(u => u.user_id == req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get user" });
  }
});

// DELETE - Remove a user by ID (MongoDB)
router.delete('/users/:id', verifyToken, async (req, res) => {
  try {    
      deleteMongo("users",{ user_id: req.params.id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete user", message: err.message });
  }
});

// Export the route
module.exports = router;
