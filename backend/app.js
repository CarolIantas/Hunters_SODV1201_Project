const path = require('path')
const cors = require('cors')
const express = require('express')


const app = express()
const PORT = process.env.PORT

app.use(cor())
app.use(express.json())
console.log("Backend login here")