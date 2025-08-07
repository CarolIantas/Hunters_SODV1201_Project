// SetUp getting the required things for user routing
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

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

// CREATE - Sign up a new user
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

  // Formatting data save to database
  const ObjectName = {
    firstName: newUser.firstName.replace(/[^\w\s]/gi, ''),
    lastName: newUser.lastName.replace(/[^\w\s]/gi, '')
  }

  const FormattedUser = {
    id: users.length+1,
    Fullname: `${ObjectName.firstName} ${ObjectName.lastName}`,
    firstName: ObjectName.firstName,
    lastName: ObjectName.lastName,
    email: newUser.email.replace,
    phone: newUser.phone.replace(/[^\w\s]/gi, ''),
    password: newUser.password.replace(/[^\s]/gi, ''),
    role: newUser.role
  };

  users.push(FormattedUser);
  writeUsers(users);

  res.status(201).json({ message: "User created", user: newUser });
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
  const index = users.findIndex(user => user.email === login.email && user.password === login.password)
  if (index > -1) {
    return res.status(201).json({ message: "Authorized", user: users[index] }); 
  }

  return res.status(401).json({ message: "Login not valid." });
});

// READ - Get all users
router.get('/users', (req, res) => {  
  const users = readUsers();
  res.json(users);
});

// READ - Get a user by ID
router.get('/users/:id', (req, res) => {
  const users = readUsers();
  const user = users.find(u => u.id == req.params.id);

  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// UPDATE - Update a user by ID
router.put('/users/:id', (req, res) => {
  const users = readUsers();
  const index = users.findIndex(u => u.id == req.params.id);

  if (index === -1) return res.status(404).json({ message: "User not found" });

  const updatedUser = { ...users[index], ...req.body };
  users[index] = updatedUser;
  writeUsers(users);

  res.json({ message: "User updated", user: updatedUser });
});

// DELETE - Remove a user by ID
router.delete('/users/:id', (req, res) => {
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
