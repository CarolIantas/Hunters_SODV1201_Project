const express = require('express');
const fs = require("fs");
const path = require("path");
const router = express.Router();
const verifyToken = require("./token");
const {readMongo, updateMongo, deleteMongo, createMongo} = require("../data/mongo.js");


// File configuration
const FILENAME = "reviews.json";
const FILEPATH = path.join(__dirname.replace("routing","data"), FILENAME);

// Helper: read properties from file
function readProperties(user = null) {    

  if (!fs.existsSync(FILEPATH)) return [];    
  const properties = JSON.parse(fs.readFileSync(FILEPATH, 'utf8')); // Now it's an array  
  
  let data = properties;
  
  //check if is there any filter
  if (user !== null ){        
    if (user.role === "owner"){      
      data = properties.filter(f => f.user_id === user.user_id);      
    }    
  };

  return data;
}

// Helper: write properties to file
function writeProperties(properties) {
  fs.writeFileSync(FILEPATH, JSON.stringify(properties, null, 2), 'utf8');
}

router.post('reviews/user', verifyToken, (req, res) => {})
router.post('reviews/workspace', verifyToken, (req, res) => {})
router.get('reviews/user', verifyToken, (req, res) => {})
router.get('reviews/user/:id', verifyToken, (req, res) => {})
router.get('reviews/workspace', verifyToken, (req, res) => {})
router.get('reviews/workspace/:id', verifyToken, (req, res) => {})


module.exports = verifyToken;
