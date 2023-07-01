const jwt = require("jsonwebtoken")
const menuItemModel = require('../models/MenuItemModel')

const controllers = {

    listItems: async (req, res) => {
        const items = await menuItemModel.find()
        res.json(items)
    },

    getItem: async (req, res) => {
        const itemID = req.params.itemID
        let menuItem = null

        try {
            // use model to find by id
            menuItem = await menuItemModel.findById(itemID)
        } catch(err) {
            // if any error -> return response 500
            res.statusCode = 500
            return res.json()
        }

        // if not exists -> return response 404
        if (!menuItem) {
            console.log('does not exisxts')
            res.statusCode = 404
            return res.json()
        }

        // return json response of the fetched data
        return res.json(menuItem)
    },

    createItem: async (req, res) => {
        // get the data from request
        const data = req.body

        // TODO: data validation

        // let imageData = data.image
        // if (!imageData) {
        //     imageData = ''
        // }

        // insert to DB using model
        const result = await menuItemModel.create({
            name: data.name,
            price: data.price,
            image: data.image ?? ''
        })

        res.statusCode = 201
        res.json({
            msg: "Created successfully"
        })
    },

    updateItem: async (req, res) => {
        // get the data from the req body
        const data = req.body

        console.log(req.params.itemID)

        // TODO: validation

        // try get the item from DB, if not exists, return 404 not found response
        let item = null // -> will evaluate to a falsy value

        try {
            item = await menuItemModel.findById(req.params.itemID)
        } catch(err) {
            console.log(err)
            res.statusCode = 500
            return res.json()
        }

        if (!item) {
            res.statusCode = 404
            return res.json()
        }

        console.log(item)

        // if image is given to be updated, then update, else no change
        let image = item.image
        if (data.image) {
            image = data.image
        }

        console.log(image)

        // use menu item model to update into database
        try {
            await menuItemModel.updateOne(
                {
                    _id: req.params.itemID
                },
                {
                    name: data.name,
                    price: data.price,
                    image: image
                }
            )
        } catch(err) {
            console.log(err)
            res.statusCode = 500
            return res.json()
        }

        console.log('updated')
        
        res.json()
    },

}

module.exports = controllers
