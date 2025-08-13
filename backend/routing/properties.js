// SetUp getting the required things for properties routing
const express = require('express');
const fs = require('fs');
const path = require('path');
const { title } = require('process');
const router = express.Router();
const verifyToken = require("./token");
const {readMongo, updateMongo, deleteMongo, createMongo} = require("../data/mongo.js");
const { ObjectId } = require('mongodb'); 

// File configuration
const FILENAME = "properties.json";
const FILEPATH = path.join(__dirname.replace("routing","data"), FILENAME);

// Helper: read properties from file
async function readProperties(filters = {}) {    

  try {    
    const properties = await readMongo("properties",filters);    
    return(properties);
  } catch (err) {
    console.log({ error: 'Failed to read properties', message: err.message });
  }
}

// Helper: write properties to file
function writeProperties(properties) {
  fs.writeFileSync(FILEPATH, JSON.stringify(properties, null, 2), 'utf8');
}

// CREATE - Add a new property
router.post('/properties', verifyToken, async (req, res) => {
  try {
    const properties = await readProperties();
    const newProperty = req.body;
    
    //get maxid to add + 1
    const sortedProp = properties.sort((a, b) => a.property_id - b.property_id);
    
    let maxId = sortedProp[sortedProp.length-1]?.property_id;
    if (maxId == undefined) {
      maxId = 0;
    };
    maxId++;

    // Check for duplicate ID
    if (properties.some(p => p.property_id === maxId)) {
      return res.status(409).json({ message: "Property with this ID already exists" });
    }

    // Formatting data save to database
    const FormattedProperties = {
      property_id: maxId,
      user_id: newProperty.user_id,
      title: newProperty.title,
      address: newProperty.address,
      neighborhood: newProperty.neighborhood,    
      image: newProperty.image,    
      SQ_foot: newProperty.SQ_foot,            
      parking: newProperty.parking,
      public_transport: newProperty.public_transport,
      status: newProperty.status,
      create_date: newProperty.date
    };
    
    createMongo("properties", FormattedProperties);

    res.status(201).json({ message: "Property created", property: FormattedProperties });
  } catch (err) {
    res.status(500).json({ error: "Failed to create property", message: err.message });
  }
  
});

// READ - Get all properties
router.get('/properties', verifyToken, async (req, res) => {
  const properties = await readProperties();
  res.json(properties);
});

// READ - Get all properties
router.post('/properties/user', verifyToken, async (req, res) => {
  const user = req.body;
  const properties = await readProperties({user_id: parseInt(user.user_id)});  
  res.json(properties);
});

// READ - Get a property by ID
router.get('/properties/:id', verifyToken, async (req, res) => {
  const properties = await readProperties({property_id: parseInt(req.params.id)});  
  
  if (!properties) return res.status(404).json({ message: "Property not found" });
  res.json(properties[0]);
});

// UPDATE - Update a property by ID
router.put('/properties/:id', verifyToken, async (req, res) => {    
  try {    
    const property = req.body;
    
    const updatedProperty = { $set: { 
      property_id: parseInt(property.property_id),
      user_id: property.user_id,
      title: property.title,
      address: property.address,
      neighborhood: property.neighborhood,    
      image: property.image,    
      SQ_foot: property.SQ_foot,            
      parking: property.parking,
      public_transport: property.public_transport,
      status: property.status,
      create_date: property.date
    } } 

    await updateMongo("properties", updatedProperty, {property_id: parseInt(property.property_id) });
    res.status(201).json({ message: "Property updated", property: property });    
  } catch (err) {
    res.status(500).json({ error: "Failed to update property", message: err.message });
  }   
});

// DELETE - Remove a property by ID
router.delete('/properties/:id', verifyToken, async (req, res) => {
  try {      
    deleteMongo("properties", {property_id: parseInt(req.params.id)});
    res.status(201).json({ message: "Property deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete property", message: err.message });
  }
});

// Export the route
module.exports = router;
