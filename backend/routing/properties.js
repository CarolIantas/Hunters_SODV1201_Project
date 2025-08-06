// SetUp getting the required things for properties routing
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// File configuration
const FILENAME = "properties.json";
const FILEPATH = path.join(__dirname.replace("routing","data"), FILENAME);

// Helper: read properties from file
function readProperties() {  
  if (!fs.existsSync(FILEPATH)) return [];  
  const data = fs.readFileSync(FILEPATH, 'utf8');  
  return data ? JSON.parse(data) : [];
}

// Helper: write properties to file
function writeProperties(properties) {
  fs.writeFileSync(FILEPATH, JSON.stringify(properties, null, 2), 'utf8');
}

// CREATE - Add a new property
router.post('/properties', (req, res) => {
  const properties = readProperties();
  const newProperty = req.body;

  // Optional: Validate required fields
  if (!newProperty.id || !newProperty.name || !newProperty.location) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Check for duplicate ID
  if (properties.some(p => p.id === newProperty.id)) {
    return res.status(409).json({ message: "Property with this ID already exists" });
  }

  properties.push(newProperty);
  writeProperties(properties);

  res.status(201).json({ message: "Property created", property: newProperty });
});

// READ - Get all properties
router.get('/properties', (req, res) => {
  const properties = readProperties();
  res.json(properties);
});

// READ - Get a property by ID
router.get('/properties/:id', (req, res) => {
  const properties = readProperties();
  const property = properties.find(p => p.id == req.params.id);

  if (!property) return res.status(404).json({ message: "Property not found" });
  res.json(property);
});

// UPDATE - Update a property by ID
router.put('/properties/:id', (req, res) => {
  const properties = readProperties();
  const index = properties.findIndex(p => p.id == req.params.id);

  if (index === -1) return res.status(404).json({ message: "Property not found" });

  const updatedProperty = { ...properties[index], ...req.body };
  properties[index] = updatedProperty;
  writeProperties(properties);

  res.json({ message: "Property updated", property: updatedProperty });
});

// DELETE - Remove a property by ID
router.delete('/properties/:id', (req, res) => {
  const properties = readProperties();
  const filteredProperties = properties.filter(p => p.id != req.params.id);

  if (properties.length === filteredProperties.length) {
    return res.status(404).json({ message: "Property not found" });
  }

  writeProperties(filteredProperties);
  res.json({ message: "Property deleted" });
});

// Export the route
module.exports = router;
