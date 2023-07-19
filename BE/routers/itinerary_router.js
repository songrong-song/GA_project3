const express = require('express')
const router = express.Router()
const itineraryController = require('../controllers/itinerary_controller')
const authMiddleware = require('../middlewares/auth_middleware')

router.post('/', itineraryController.findItinerary)
router.post('/createGPT', itineraryController.createItinerary)

module.exports = router
