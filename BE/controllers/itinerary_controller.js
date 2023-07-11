const Joi = require("joi")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const itenaryModel = require("../models/ItineraryModel")
const userValidators = require("./validators/userValidator")
const gptControllers = require("./GPT_controller.js")

const itineraryControllers = {

    createItinerary: async (req, res) => {
        // get the registration data in the req
        data = req.body
        console.log(data)
        
        // generate the ChatGPT result
        try {
            
            if (!data.hasOwnProperty('destinationValue') || data.destinationValue === '') {
                const destinations = ['New York', 'Paris', 'Tokyo', 'London'];
                const randomIndex = Math.floor(Math.random() * destinations.length);
                data.destinationValue = destinations[randomIndex];
            }

            const attraction1 = await gptControllers.generateDestinationResult1(data.destinationValue);
            const attraction2 = await gptControllers.generateDestinationResult2(data.destinationValue);
            const restaurant1 = await gptControllers.generateRestaurantResult(attraction1);
            const restaurant2 = await gptControllers.generateRestaurantResult(attraction2);

            Day1 = {'attraction1': attraction1, 
            'attraction2': attraction2, 
            'restaurant1': restaurant1, 
            'restaurant2': restaurant2 }


            storeData = 
            {
                 "Day1": Day1
            };
            
         
            // Code to handle the successful result1
            return res.json({
                storeData
            });

        } catch(err) {
            res.statusCode = 500;
            return res.json({
                msg: "failed to create user"
            });
        }
   
    },

    storeItinerary: async ()=>{


    }


}

module.exports = itineraryControllers