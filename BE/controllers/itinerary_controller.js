const Joi = require("joi")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const itenaryModel = require("../models/ItineraryModel")
const userValidators = require("./validators/userValidator")
const gptControllers = require("./GPT_controller.js")

const itineraryControllers = {

    createItinerary: async (req, res) => {
        // get the registration data in the req
        const data = req.body
        
        // generate the ChatGPT result
        try {
            const result1 = await gptControllers.generateDestinationResult1(data.destinationValue);
            // Code to handle the successful result1
            return res.json({
                result: result1
            });
        } catch(err) {
            res.statusCode = 500;
            return res.json({
                msg: "failed to create user"
            });
        }
        
        // use user model to create a new user
        try {
            await userModel.create({
                name: data.name,
                email: data.email,
                password: hash,
            })
        } catch(err) {
            res.statusCode = 500
            return res.json({
                msg: "failed to create user"
            })
        }
        
        // return response
        res.json()
    },


    getItenary: async (req, res) => {
        // // validate query param: menu_item_id
        // const userID = req.query.user_id
        // if (!menuItemID) {
        //     res.statusCode = 400
        //     return res.json({
        //         msg: "menu item ID not specified"
        //     })
        // }

        // // fetch data
        // let reviews = []

        // try {
        //     reviews = await reviewModel
        //         .find({
        //             menu_item: menuItemID
        //         })
        //         .populate(['menu_item', 'reviewer'])
        // } catch(err) {
        //     res.statusCode = 500
        //     return res.json()
        // }
        console.log("hey")
        res.json({ message: 'Hello World' })
    }


}

module.exports = itineraryControllers