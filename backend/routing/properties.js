//SetUp getting the require thing for proerties routing
const express = require('express')
const fs = require('fs')
const path = require('path')
const router = express.Router()

//route method with function for each

//pathing to file
const FILENAME = "properties.json"
const FILEPATH = path.join(__dirname, FILENAME)

console.log(FILEPATH)
//function

//export the route method
module.exports = router