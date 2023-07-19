const express = require('express')
const router = express.Router()
const GPTController = require('../controllers/GPT_controller')


// not expose chatGPT yet
// router.post('/d_prompt1', GPTController.generateDestinationPrompt1)
// router.post('/d_prompt2', GPTController.generateDestinationPrompt2)
// router.post('/d_result1', GPTController.generateDestinationResult1)
// router.post('/d_result2', GPTController.generateDestinationResult2)
// router.get('/response', GPTController.response)

module.exports = router
