const express = require('express')
const app = express()
const labRouter = require('./routes/routes.js')

app.use(express.json())
app.use(labRouter)


app.listen(3000)