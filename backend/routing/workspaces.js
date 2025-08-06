//SetUp getting the require thing for workspaces routing
const express = require('express')
const fs = require('fs')
const path = require('path')
const router = express.Router()

//route method with function for each

//pathing to file
const FILENAME = "workspaces.json"
const FILEPATH = path.join(__direname, FILENAME)

//function

//export the route method
module.exports = router