const cors = require('cors')
const express = require('express')
//const { MongoClient } = require('mongodb')

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


//Port and listening for server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    
})

