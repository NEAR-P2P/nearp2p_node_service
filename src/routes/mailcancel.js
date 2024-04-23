const express = require('express')
const router = express.Router()
const { mailCancel } = require('../controllers/mailcancel')

router.get('/cancel/:from/:to', mailCancel)

module.exports = router