const path = require('path')
const cors = require('cors')
const express = require('express')
const userRoutes = require('./routing/user')
const propertiesRoutes = require('./routing/properties')
const workspaceRoutes = require('./routing/workspaces')


const app = express()
const PORT = process.env.PORT || 3000;

app.use(cors())
app.use(express.json())
app.use(userRoutes)
app.use(propertiesRoutes)
app.use(workspaceRoutes)

console.log("Backend login here")




app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})