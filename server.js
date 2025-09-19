require('dotenv').config()
const fs = require('fs')
const http = require('http')
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const { dbConnect } = require('./config/postgres')
const bodyParser = require('body-parser')

app.use(bodyParser.json())
dbConnect()
app.use(morgan('dev'))

// --- CORS Configuration ---
const corsOptions = {
  origin: true, // Allow all origins
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false // Set to false when origin is not specific
};

app.use(cors(corsOptions));

// Handle preflight OPTIONS requests
app.options('*', cors(corsOptions));

app.use('/api/sendmailp2p', require('./src/routes'))

// Starting http server
const httpServer = http.createServer(app)

httpServer.listen(3070, () => {
  console.log('HTTP Server running on port 3070')
})