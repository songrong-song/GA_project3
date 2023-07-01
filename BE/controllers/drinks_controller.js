const drinkModel = require('../models/drinks')

const controller = {
    index: (req, res) => {
        res.render('drinks/index', {drinks: drinkModel})
    },

    show: (req, res) => {
        let drinkID = 0

        try {
            drinkID = Number(req.params.drinkID)
        } catch {
            return res.send('invalid drink ID')
        }

        // TODO: to check if given drinkID exists

        res.render('drinks/show', {drink: drinkModel[drinkID], drinkID: drinkID})
    },

    newDrinkForm: (req, res) => {
        res.render('drinks/new')
    },
    
    createDrink: (req, res) => {
        console.log(req.body)
        // TODO: data validation
        
        drinkModel.push({
            name: req.body.drink_name,
            price: Number(req.body.price)
        })

        res.redirect('/drinks')
    },

    editDrinkForm: (req, res) => {
        // get drink from drinkID in req
        const drinkID = req.params.drinkID

        // TODO: validation

        // get the drink by ID
        const drink = drinkModel[drinkID]

        res.render('drinks/edit', {drink: drink, drinkID: drinkID})
    },

    updateDrink: (req, res) => {
        // get drink ID from req, and perform validations
        let drinkID = req.params.drinkID

        // validation: convert to number, if cannot, throw error
        try {
            drinkID = Number(drinkID)
        } catch(err) {
            return res.send('drink ID cannot be parsed to a number')
        }

        // ensure data is present: number is within array data range
        if (drinkModel[drinkID] === undefined) {
            res.status = 404
            return res.send('drink ID not found')
        }

        // TODO: validate form data
        //  - drink_name is not empty
        //  - price is not empty and > 0

        // update data to array
        drinkModel[drinkID].name = req.body.drink_name
        drinkModel[drinkID].price = req.body.price

        drinkModel[drinkID] = {
            name: req.body.drink_name,
            price: req.body.price
        }

        res.redirect('/drinks')
    },

    deleteDrink: (req, res) => {
        // get drink ID from req, and perform validations
        let drinkID = req.params.drinkID

        // ensure data is present: number is within array data range

        // remove item from array -> JS array method: splice
        drinkModel.splice(drinkID, 1)

        res.redirect('/drinks')
    },
}

module.exports = controller
