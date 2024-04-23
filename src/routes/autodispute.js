const express = require('express')
const router = express.Router()
const { autoDispute } = require('../controllers/autodispute')

router.post('/autodispute/:from/:to/:order/:type/:wallet/:key/:network/:cn/:token/:time', autoDispute)

module.exports = router