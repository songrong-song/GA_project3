const express = require('express')
const router = express.Router()
const menuItemController = require('../controllers/menu_item_controller')
const authMiddleware = require('../middlewares/auth_middleware')

router.get('/', menuItemController.listItems)
router.get('/:itemID', menuItemController.getItem)
router.post('/', authMiddleware, menuItemController.createItem)
router.patch('/:itemID', authMiddleware, menuItemController.updateItem)

module.exports = router
