const express = require('express')
const router = express.Router()
const userItineraryController = require('../controllers/userItinerary_controller')

router.post('/', userItineraryController.fetchHistoricalResult)
router.post('/saveItinerary', userItineraryController.saveResult)

module.exports = router
