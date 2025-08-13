// SetUp getting the required things for workspaces routing
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const verifyToken = require("./token");
const {readMongo, updateMongo, deleteMongo, createMongo} = require("../data/mongo.js");

// Helper: read workspaces from file
async function readWorkspaces(filters = {}) {    

  try {    
    const workspaces = await readMongo("workspaces",filters);    
    return(workspaces);
  } catch (err) {
    console.log({ error: 'Failed to read workspaces', message: err.message });
  }
}

// CREATE - Add a new workspace
router.post('/workspaces', verifyToken, async (req, res) => {
  try {
    const workspaces = await readWorkspaces();
    const newWorkspace = req.body;

    //get maxid to add + 1
    const sortedProp = workspaces.sort((a, b) => a.workspace_id - b.workspace_id);
    
    let maxId = sortedProp[sortedProp.length-1]?.workspace_id;
    if (maxId == undefined) {
      maxId = 0;
    };
    maxId++;
    
    // Formatting data save to database
    const FormattedWorkSpaces = {
      workspace_id: maxId,
      property_id: parseInt(newWorkspace.property_id),
      name: newWorkspace.name,    
      description: newWorkspace.description,
      type_of_room: newWorkspace.type_of_room,
      capacity: newWorkspace.capacity,
      smoking: newWorkspace.smoking,
      date: newWorkspace.date,
      term: newWorkspace.term,
      price: newWorkspace.price,    
      image: newWorkspace.image,        
      availability_status: newWorkspace.availability_status,        
    };
  
    createMongo("workspaces", FormattedWorkSpaces);

    res.status(201).json({ message: "Workspace created", workspace: FormattedWorkSpaces });    
  } catch (err) {
    res.status(500).json({ error: "Failed to create workspace", message: err.message });
  }
});

// READ - Get all workspaces
router.get('/workspaces', verifyToken, async (req, res) => {
  const workspaces = await readWorkspaces();
  res.json(workspaces);
});

// READ - Get a workspace by ID
router.get('/workspaces/:id', verifyToken, async (req, res) => {  
  const workspace = await readWorkspaces({workspace_id: parseInt(req.params.id)});
  if (!workspace) return res.status(404).json({ message: "Workspace not found" });
  res.json(workspace[0]);
});

// READ - Get a workspace by properties Id
router.get('/workspaces/property/:propID', verifyToken, async (req, res) => {
  const workspaces = await readWorkspaces({property_id: parseInt(req.params.propID)});  

  if (!workspaces) return res.status(404).json({ message: "Workspace not found" });
  res.json(workspaces);
});


// UPDATE - Update a workspace by ID
router.put('/workspaces/:id', verifyToken, async (req, res) => {
  try {

    const workspace = req.body;
    
    const FormattedWorkSpace = {
      workspace_id: parseInt(workspace.workspace_id),
      property_id: parseInt(workspace.property_id),
      name: workspace.name,    
      description: workspace.description,
      type_of_room: workspace.type_of_room,
      capacity: workspace.capacity,
      smoking: workspace.smoking,
      date: workspace.date,
      term: workspace.term,
      price: workspace.price,    
      image: workspace.image,        
      availability_status: workspace.availability_status,        
    };

    await updateMongo("workspaces", { $set: FormattedWorkSpace},{workspace_id: FormattedWorkSpace.workspace_id});

    res.status(201).json({ message: "Workspace updated", workspace: FormattedWorkSpace });    
  } catch (err) {
    res.status(500).json({ error: "Failed to update property", message: err.message });
  }   

});

// DELETE - Remove a workspace by ID
router.delete('/workspaces/:id', verifyToken, async (req, res) => {
  try {      
    deleteMongo("workspaces", {workspace_id: parseInt(req.params.id)});
    res.status(201).json({ message: "Workspace deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete workspace", message: err.message });
  }
});

// Export the route method
module.exports = router;
