const cors = require('cors')
const express = require('express')
//const { MongoClient } = require('mongodb')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const mongo = require("./data/mongo.js");

const app = express()

app.use(cors())
app.use(express.json())

//Routing
const userRoutes = require('./routing/user')
app.use(userRoutes)
const propertiesRoutes = require('./routing/properties')
app.use(propertiesRoutes)
const workspaceRoutes = require('./routing/workspaces')
app.use(workspaceRoutes)
const reviewRoutes = require('./routing/reviews')
app.use(reviewRoutes)

//Port and listening for server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
     console.log(`Server is running on http://localhost:${PORT}`)
})

