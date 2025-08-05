//SetUp getting the require thing for user routing
const express = require('express')
const fs = require('fs')
const path = require('path')
const router = express.Router()

//route method with function for each
router.post('/user/sign_up', signUpUser())

router.get()

//pathing to file
const FILENAME = "users.json"
const FILEPATH = path.join(__direname, FILENAME)

//function

module.exports = router