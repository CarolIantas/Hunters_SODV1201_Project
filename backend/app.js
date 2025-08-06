const path = require('path')
const cors = require('cors')
const express = require('express')

const app = express()

app.use(cors())
app.use(express.json())

//Routing
const userRoutes = require('./routing/user')
app.use('/user', userRoutes)
const propertiesRoutes = require('./routing/properties')
app.use('/porperties', propertiesRoutes)
const workspaceRoutes = require('./routing/workspaces')
app.use('/workspaces', workspaceRoutes)

//Port and listening for server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
    
})