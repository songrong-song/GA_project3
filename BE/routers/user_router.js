const express = require('express')
const router = express.Router()
const userController = require('../controllers/user_controller')

router.post('/register', userController.register)
router.post('/login', userController.login)

module.exports = router
