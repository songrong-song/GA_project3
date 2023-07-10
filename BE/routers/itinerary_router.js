const express = require('express')
const router = express.Router()
const itineraryController = require('../controllers/itinerary_controller')
const authMiddleware = require('../middlewares/auth_middleware')

// router.post('/', authMiddleware, itineraryController.createItenary)
router.post('/', itineraryController.createItinerary)
// router.get('/', itineraryController.getItinerary)

module.exports = router
