require('dotenv').config()
const cors = require('cors')

const port = process.env.API_PORT || 9999
const initMongodb = require('./mongodb-server')
const express = require('express')
const app = express()


// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// Routes
app.use('/api/products', require('./Controllers/productsController'))
app.use('/api/authentication', require('./Controllers/authenticationController'))


//initialize
initMongodb()
app.listen(port, () => console.log(`Web Api is running at http://localhost:${port}`))
