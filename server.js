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

// --- Production CORS Configuration ---
const whitelist = [
  'https://nearp2p.com',
  'https://www.nearp2p.com',
  'https://mi.arepa.digital',
  'https://metademocracia.social'
  // Add any other domains or subdomains that need access
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true); // Origin is in the whitelist
    } else {
      callback(new Error('Not allowed by CORS')); // Origin is not in the whitelist
    }
  },
  methods: 'GET, POST',
  credentials: true
};

app.use(cors(corsOptions));

app.use('/api/sendmailp2p', require('./src/routes'))

// Starting http server
const httpServer = http.createServer(app)

httpServer.listen(3070, () => {
  console.log('HTTP Server running on port 3070')
})
