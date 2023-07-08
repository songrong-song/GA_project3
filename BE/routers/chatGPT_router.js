const express = require('express')
const router = express.Router()
const GPTController = require('../controllers/GPT_controller')

router.post('/prompt', GPTController.prompt)
router.get('/response', GPTController.response)

module.exports = router
