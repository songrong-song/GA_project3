const Joi = require("joi")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userItineraryModel = require("../models/UserItineraryModel")
const userValidators = require("./validators/userValidator")


const userControllers = {
    fetchHistoricalResult: async (req, res) => {
        // get the registration data in the req

        var userId = req.body.userId;
        console.log(userId)

        try {
            const result = await userItineraryModel.find( {userId: userId} )
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
      
      try {
        console.log("here")
        console.log(req.body)
        // Extract the necessary data from the request
        const { userID, destinationValue, dayValue, itinerary } = req.body;
    
        // Create a new UserItinerary instance
        const userItinerary = new userItineraryModel({

          userId: userID,
          dayValue: dayValue,
          destination:  destinationValue,
          itineraries:  itinerary,
        
        });
    
        // Save the UserItinerary to the database
        await userItinerary.save();
    
        // Send a success response
        res.status(200).json({ message: 'User itinerary saved successfully' });
      } catch (error) {
        // Handle any errors and send an error response
        console.error('Error saving user itinerary:', error);
        res.status(500).json({ message: 'An error occurred while saving user itinerary' });
      }
    
    } 
        


   
}

module.exports = userControllers