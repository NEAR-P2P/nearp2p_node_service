const express = require('express')
const router = express.Router()
const { mailGeneric } = require('../controllers/mailgeneric')

router.get('/:from/:to/:order/:type', mailGeneric)

module.exports = router