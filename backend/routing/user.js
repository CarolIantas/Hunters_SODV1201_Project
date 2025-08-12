// SetUp getting the required things for user routing
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const verifyToken = require("./token");

// File configuration
const FILENAME = "users.json";
const FILEPATH = path.join(__dirname.replace("routing","data"), FILENAME);

// Helper: read users from file
function readUsers() {  
  if (!fs.existsSync(FILEPATH)) return [];  
  const data = fs.readFileSync(FILEPATH, 'utf8');
  return data ? JSON.parse(data) : [];
}

// Helper: write users to file
function writeUsers(users) {
  fs.writeFileSync(FILEPATH, JSON.stringify(users, null, 2), 'utf8');
}

// Helper: hashing password
function hashUserPassword(password, salt){
  return crypto.pbkdf2Sync(password, salt, 20, 64, 'sha512')
}

// CREATE - Sign up a new user
//NO JWT VALIDATION FOR CREATING AN USER
router.post('/users', (req, res) => {
  const users = readUsers();
  const newUser = req.body;
  
  // Optional: Validate required fields
  if (!newUser.password || !newUser.firstName || !newUser.lastName || !newUser.email) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Check for duplicate Email
  if (users.some(user => user.email === newUser.email)) {
    return res.status(409).json({ message: "User with this Email already exists" });
  }

  //get maxid to add + 1
  const sortedProp = users.sort((a, b) => a.user_id - b.users_id);
  
  let maxId = sortedProp[sortedProp.length-1]?.user_id;
  if (maxId == undefined) {
    maxId = 0;
  };
  maxId++;

  // Formatting data save to database
  const CleaningAndCreatingData = {
    firstName: newUser.firstName.replace(/[^\w\s]/gi, ''),
    lastName: newUser.lastName.replace(/[^\w\s]/gi, ''),
    salt: crypto.randomBytes(32).toString('hex')
  }

  const FormattedUser = {
    user_id: maxId,
    Fullname: `${CleaningAndCreatingData.firstName} ${CleaningAndCreatingData.lastName}`,
    firstName: CleaningAndCreatingData.firstName,
    lastName: CleaningAndCreatingData.lastName,
    email: newUser.email,
    phone: newUser.phone,
    Hashpassword: hashUserPassword(newUser.password, CleaningAndCreatingData.salt),
    role: newUser.role,
    Salt: CleaningAndCreatingData.salt
  };

  const sanitizeUser = {
    user_id: FormattedUser.user_id,
    Fullname: FormattedUser.Fullname,
    email: FormattedUser.email,
    phone: FormattedUser.phone,
    role: FormattedUser.role,
  }

  users.push(FormattedUser);
  writeUsers(users);

  res.status(201).json({ message: "User created", user: sanitizeUser });
});

// Login - user
router.post('/users/login', (req, res) => {
  const users = readUsers();
  const login = req.body;

  if (!login) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (!login.password || !login.email) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Check for valid login
  const index = users.findIndex(user => user.email === login.email && Buffer.from(user.Hashpassword).equals(hashUserPassword(login.password, user.Salt || "")))

  if (index < 0) {
    return res.status(404).json({ error: "User not found" });
  }

  const user = {
    user_id: users[index].user_id,
    Fullname: users[index].Fullname,
    email: users[index].email,
    phone: users[index].phone,
    role: users[index].role, 
  }

  //user node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" to generate a random secret
  //check if there is no secret on env utilize thi random one
  const token = jwt.sign(users[index], process.env.JWT, {
    expiresIn: 86400
  })

  //add token in the object
  user.token = token;

  if (index > -1) {
    return res.status(201).json({ message: "Authorized", user: user }); 
  }

  return res.status(401).json({ message: "Login not valid." });
});

// READ - Get all users
router.get('/users', (req, res) => {  
  const users = readUsers();
  res.json(users);
});

// READ - Get a user by ID
router.get('/users/:id', verifyToken, (req, res) => {  
  const users = readUsers();
  const user = users.find(u => u.user_id == req.params.id);

  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// UPDATE - Update a user by ID
router.put('/users/:id', verifyToken, (req, res) => {
  const users = readUsers();
  const index = users.findIndex(u => u.user_id == req.params.id);

  if (index === -1) return res.status(404).json({ message: "User not found" });

  const updatedUser = { ...users[index], ...req.body };
  users[index] = updatedUser;
  writeUsers(users);

  res.json({ message: "User updated", user: updatedUser });
});

// DELETE - Remove a user by ID
router.delete('/users/:id', verifyToken, (req, res) => {
  const users = readUsers();
  const filteredUsers = users.filter(u => u.id != req.params.id);

  if (users.length === filteredUsers.length) {
    return res.status(404).json({ message: "User not found" });
  }

  writeUsers(filteredUsers);
  res.json({ message: "User deleted" });
});

// Export the route
module.exports = router;
