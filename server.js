require('dotenv').config()
const fs = require('fs')
const https = require('https')
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const { dbConnect } = require('./config/postgres')
const bodyParser = require('body-parser')

// Certificate
const privateKey = fs.readFileSync('/etc/letsencrypt/live/nearp2p.com/privkey.pem', 'utf8')
const certificate = fs.readFileSync('/etc/letsencrypt/live/nearp2p.com/cert.pem', 'utf8')
const ca = fs.readFileSync('/etc/letsencrypt/live/nearp2p.com/chain.pem', 'utf8')

app.use(bodyParser.json())
dbConnect()
app.use(morgan('dev'))

const credentials = {
  key: privateKey,
  cert: certificate,
  ca
}

/*
app.use(cors({
  origin: 'https://nearp2p.com'
  //origin: '*'
})); */
app.use(cors({ origin: '*', origin: true, methods: 'GET, POST', credentials: true }))

app.use('/api/sendmailp2p', require('./src/routes'))

// Starting both http & https servers
const httpsServer = https.createServer(credentials, app)

httpsServer.listen(3070, () => {
  console.log('HTTPS Server running on port 3070')
})
