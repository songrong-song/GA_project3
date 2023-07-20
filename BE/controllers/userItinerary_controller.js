const Joi = require("joi")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userItineraryModel = require("../models/UserItineraryModel")
const userValidators = require("./validators/userValidator")


const userControllers = {
    fetchHistoricalResult: async (req, res) => {
        // get the registration data in the req
        const data = req.body;
        console.log(data);
        var userEmail = data.userEmail;

        try {
            const result = await userItineraryModel.find({ userEmail: userEmail })
            if (result) {
              // User found
              res.json(result);
            } else {
              // User not found
              res.status(404).json({ error: "Itinerary not found" });
            }
          } catch (error) {
            console.error('Error finding user:', error);
            res.status(500).json({ error: 'Fail to return the Itinerary' });
          }
    },

    saveResult: async (req, res) => {
        // get the registration data in the req
        const data = req.body;
        console.log(data);
        var userEmail = data.userEmail;

        try {
            const result = await userItineraryModel.find({ userEmail: userEmail })
            if (result) {
              // User found
              res.json(result);
            } else {
              // User not found
              res.status(404).json({ error: "Itinerary not found" });
            }
          } catch (error) {
            console.error('Error finding user:', error);
            res.status(500).json({ error: 'Fail to return the Itinerary' });
          }
    } 
        


   
}

module.exports = userControllers