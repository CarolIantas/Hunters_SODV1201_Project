// SetUp getting the required things for workspaces routing
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// File configuration
const FILENAME = "workspaces.json";
const FILEPATH = path.join(__dirname.replace("routing","data"), FILENAME);

// Helper: read workspaces from file
function readWorkspaces() {
  if (!fs.existsSync(FILEPATH)) return [];
  const data = fs.readFileSync(FILEPATH, 'utf8');
  return data ? JSON.parse(data) : [];
}

// Helper: write workspaces to file
function writeWorkspaces(workspaces) {
  fs.writeFileSync(FILEPATH, JSON.stringify(workspaces, null, 2), 'utf8');
}

// CREATE - Add a new workspace
router.post('/workspaces', (req, res) => {
  const workspaces = readWorkspaces();
  const newWorkspace = req.body;

  // Optional: Validate required fields
  if (!newWorkspace.id || !newWorkspace.name || !newWorkspace.type) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Check for duplicate ID
  if (workspaces.some(w => w.id === newWorkspace.id)) {
    return res.status(409).json({ message: "Workspace with this ID already exists" });
  }

  workspaces.push(newWorkspace);
  writeWorkspaces(workspaces);

  res.status(201).json({ message: "Workspace created", workspace: newWorkspace });
});

// READ - Get all workspaces
router.get('/workspaces', (req, res) => {
  const workspaces = readWorkspaces();
  res.json(workspaces);
});

// READ - Get a workspace by ID
router.get('/workspaces/:id', (req, res) => {
  const workspaces = readWorkspaces();
  const workspace = workspaces.find(w => w.id == req.params.id);

  if (!workspace) return res.status(404).json({ message: "Workspace not found" });
  res.json(workspace);
});

// UPDATE - Update a workspace by ID
router.put('/workspaces/:id', (req, res) => {
  const workspaces = readWorkspaces();
  const index = workspaces.findIndex(w => w.id == req.params.id);

  if (index === -1) return res.status(404).json({ message: "Workspace not found" });

  const updatedWorkspace = { ...workspaces[index], ...req.body };
  workspaces[index] = updatedWorkspace;
  writeWorkspaces(workspaces);

  res.json({ message: "Workspace updated", workspace: updatedWorkspace });
});

// DELETE - Remove a workspace by ID
router.delete('/workspaces/:id', (req, res) => {
  const workspaces = readWorkspaces();
  const filteredWorkspaces = workspaces.filter(w => w.id != req.params.id);

  if (workspaces.length === filteredWorkspaces.length) {
    return res.status(404).json({ message: "Workspace not found" });
  }

  writeWorkspaces(filteredWorkspaces);
  res.json({ message: "Workspace deleted" });
});

// Export the route method
module.exports = router;
