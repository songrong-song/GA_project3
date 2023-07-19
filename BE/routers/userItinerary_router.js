const express = require('express')
const router = express.Router()
const userItineraryController = require('../controllers/userItinerary_controller')

router.post('/', userItineraryController.fetchHistoricalResult)

module.exports = router
