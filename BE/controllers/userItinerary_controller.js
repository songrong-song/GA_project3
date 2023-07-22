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

        const fetchHistoricalResult = async (req, res) => {
          // Get the registration data in the req
          var userId = req.body.userId;
          console.log(userId);
        
          try {
            const result = await userItineraryModel.find({ userId: userId });
            if (result) {
              console.log("*******************");
              result.forEach((item, i) => {
                console.log(item.itineraries);
                try {
                  const itineraries = JSON.parse(item.itineraries);
                  result[i].itineraries = Array.isArray(itineraries) ? itineraries : [];
                } catch (error) {
                  console.error("Invalid JSON:", item.itineraries);
                  result[i].itineraries = [];
                }
              });
        
              // Return the result to the frontend
              res.status(200).json({ data: result });
            } else {
              // User not found
              res.status(404).json({ error: "Itinerary not found" });
            }
          } catch (error) {
            console.error('Error finding user:', error);
            res.status(500).json({ error: 'Fail to return the Itinerary' });
          }
        };
      },

      saveResult: async (req, res) => {
      
      try {
        
    
        // Extract the necessary data from the request
        const { userID, destinationValue, dayValue, itinerary } = req.body;


        // Create a new UserItinerary instance
        const userItinerary = new userItineraryModel({

          userId: userID,
          dayValue: dayValue,
          destination:  destinationValue,
          itineraries:  JSON.parse(itinerary),
        
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
    },

    deleteAllItinerariesByUserId: async (req, res) => {
      // Get the userID from the request parameters
      const { userId } = req.body;
      console.log(userId)
  
      try {
        // Delete all records with the given userId from the user itinerary collection
        await userItineraryModel.deleteMany({ userId: userId });
  
        // Send a success response
        res.status(200).json({ message: 'All itineraries for the specific user deleted successfully' });
      } catch (error) {
        // Handle any errors and send an error response
        console.error('Error deleting itineraries for the specific user:', error);
        res.status(500).json({ message: 'An error occurred while deleting itineraries for the specific user' });
      }
    },
   
}

module.exports = userControllers