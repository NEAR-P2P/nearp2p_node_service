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



app.use(cors({
  origin: '*',
  methods: 'GET, POST',
  credentials: true
}));

// app.use(cors({ origin: '*', origin: true, methods: 'GET, POST', credentials: true }))

app.use('/api/sendmailp2p', require('./src/routes'))

// Starting http server
const httpServer = http.createServer(app)

httpServer.listen(3070, () => {
  console.log('HTTP Server running on port 3070')
})
