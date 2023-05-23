const express = require('express')
const router = express.Router()
const { mailAgreement } = require('../controllers/mailagreement')

router.get('/mailagreement/:to/', mailAgreement)

module.exports = router