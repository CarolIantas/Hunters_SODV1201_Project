const path = require('path')
const cors = require('cors')
const express = require('express')


const app = express()
const PORT = process.env.PORT || 3000;

app.use(cors())
app.use(express.json())

const user = require('./routing/user')
const properties = require('./routing/properties')
const workspace = require('./routing/workspaces')
console.log("Backend login here")




app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})