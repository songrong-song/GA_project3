const express = require('express')
const router = express.Router()
const intenaryController = require('../controllers/intenary_controller')
const authMiddleware = require('../middlewares/auth_middleware')

router.post('/', authMiddleware, intenaryController.createIntenary)

module.exports = router
