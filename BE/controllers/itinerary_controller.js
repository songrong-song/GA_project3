const Joi = require("joi")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const itenaryModel = require("../models/ItineraryModel")
const userValidators = require("./validators/userValidator")
const gptControllers = require("./GPT_controller.js")
const ItineraryModel = require("../models/ItineraryModel")
const mongoose = require('mongoose');
const fs = require('fs');

const itineraryControllers = {

  createItinerary: async (data) => {

    const storeItinerary = async (input) => {
      console.log("passed item")
      console.log(input)
      const data = [input]
      mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
        .then(async () => {
          const Result = await ItineraryModel.insertMany(data);
          console.log(Result);
        })
        .catch((err) => {
          console.error('Failed to store the data:', err);
          mongoose.disconnect();
        });
    };
    // get the registration data in the req
    // generate the ChatGPT result
    try {

      if (!data.hasOwnProperty('destinationValue') || data.destinationValue === '') {
        const destinations = ['New York', 'Paris', 'Tokyo', 'London'];
        const randomIndex = Math.floor(Math.random() * destinations.length);
        data.destinationValue = destinations[randomIndex];
      }

      let attraction1_, attractionName1_, attraction2_, attractionName2_, restaurant1_, restaurant2_;

      try {
        [attraction1_, attractionName1_] = await gptControllers.generateDestinationResult1(data.destinationValue, data.exclude);
        console.log(attraction1_)
      } catch (error) {
        attraction1_ = null;
        attractionName1_ = null;
      }

      try {
        restaurant1_ = await gptControllers.generateRestaurantResult(attractionName1_);
      } catch (error) {
        restaurant1_ = null;
      }


      function convertToString(data) {
        if (typeof data === 'object') {
          try {
            return JSON.stringify(data);
          } catch (error) {
            console.error('Error converting to JSON:', error);
            return '';
          }
        } else {
          return String(data);
        }
      }

           // attraction1_ = JSON.stringify(attraction1_)
           try {
            attraction1 = JSON.parse(attraction1_);
          } catch (error) {
            attraction1_ = convertToString(attraction1_);
    
            // Check if the string contains double quotes
            if (attraction1_.includes('"')) {
              // Regular expressions for strings with double quotes
              const attractionNameRegexWithQuotes = /"Attraction Name":\s*"([^"]*)"/;
              const summaryRegexWithQuotes = /"Summary":\s*"([^"]*)"/;
              const latitudeRegexWithQuotes = /"[L|l]atitude":\s("?)*([^"]*)/;
              const longitudeRegexWithQuotes = /"[L|l]ongitude":\s("?)*([^"]*)/;
              const sojournTimeRegexWithQuotes = /"Recommended Sojourn Time":\s*"([^"]*)"/;
    
              const attractionNameMatch = attractionNameRegexWithQuotes.exec(attraction1_);
              const summaryMatch = summaryRegexWithQuotes.exec(attraction1_);
              const latitudeMatch = latitudeRegexWithQuotes.exec(attraction1_);
              const longitudeMatch = longitudeRegexWithQuotes.exec(attraction1_);
              const sojournTimeMatch = sojournTimeRegexWithQuotes.exec(attraction1_);
    
              attraction1 = {
                "Attraction Name": attractionNameMatch ? attractionNameMatch[1] : null,
                "Summary": summaryMatch ? summaryMatch[1] : null,
                "Location": {
                  "Latitude": latitudeMatch ? latitudeMatch[1] : null,
                  "Longitude": longitudeMatch ? longitudeMatch[1] : null,
                },
                "Recommended Sojourn Time": sojournTimeMatch ? sojournTimeMatch[1] : null,
              };

            } else {
              // Regular expressions for strings without double quotes
              const attractionNameRegex = /Attraction Name:\s*([^ ]*)/;
              const summaryRegex = /Summary:\s*([^ ]*)/;
              const latitudeRegex = /[L|l]atitude:\s*([^ ]*)\n/;
              const longitudeRegex = /[L|l]ongitude:\s*([^ ]*)\n/;
              const sojournTimeRegex = /Recommended Sojourn Time:\s*([^ ]*)/;
    
              const attractionNameMatch = attractionNameRegex.exec(attraction1_);
              const summaryMatch = summaryRegex.exec(attraction1_);
              const latitudeMatch = latitudeRegex.exec(attraction1_);
              const longitudeMatch = longitudeRegex.exec(attraction1_);
              const sojournTimeMatch = sojournTimeRegex.exec(attraction1_);
    
              attraction1 = {
                "Attraction Name": attractionNameMatch ? attractionNameMatch[1] : null,
                "Summary": summaryMatch ? summaryMatch[1] : null,
                "Location": {
                  "Latitude": latitudeMatch ? latitudeMatch[1] : null,
                  "Longitude": longitudeMatch ? longitudeMatch[1] : null,
                },
                "Recommended Sojourn Time": sojournTimeMatch ? sojournTimeMatch[1] : null,
              };
      
            }
          };


      // attraction1_ = JSON.stringify(attraction1_)
      try {
        restaurant1 = JSON.parse(restaurant1_);
      } catch (error) {
        restaurant1_ = convertToString(restaurant1_);

        // Check if the string contains double quotes
        if (restaurant1_.includes('"')) {
          // Regular expressions for strings with double quotes
          const restaurantNameRegexWithQuotes = /"Restaurant Name":\s*"([^"]*)"/;
          const summaryRegexWithQuotes = /"Summary":\s*"([^"]*)"/;
          const latitudeRegexWithQuotes = /"[L|l]atitude":\s*("?)([^"]*)/;
          const longitudeRegexWithQuotes = /"[L|l]ongitude":\s*("?)([^"]*)/;
          const sojournTimeRegexWithQuotes = /"Recommended Sojourn Time":\s*"([^"]*)"/;

          const restaurantNameMatch = restaurantNameRegexWithQuotes.exec(restaurant1_);
          const summaryMatch = summaryRegexWithQuotes.exec(restaurant1_);
          const latitudeMatch = latitudeRegexWithQuotes.exec(restaurant1_);
          const longitudeMatch = longitudeRegexWithQuotes.exec(restaurant1_);
          const sojournTimeMatch = sojournTimeRegexWithQuotes.exec(restaurant1_);

          restaurant1 = {
            "Restaurant Name": restaurantNameMatch ? restaurantNameMatch[1] : null,
            "Summary": summaryMatch ? summaryMatch[1] : null,
            "Location": {
              "Latitude": latitudeMatch ? latitudeMatch[1] : null,
              "Longitude": longitudeMatch ? longitudeMatch[1] : null,
            },
            "Recommended Sojourn Time": sojournTimeMatch ? sojournTimeMatch[1] : null,
          };
        } else {
          // Regular expressions for strings without double quotes
          const restaurantNameRegex = /Restaurant Name:\s*([^ ]*)/;
          const summaryRegex = /Summary:\s*([^ ]*)/;
          const latitudeRegex = /[L|l]atitude:\s*([^ ]*)\n/;
          const longitudeRegex = /[L|l]ngitude:\s*([^ ]*)\n/;
          const sojournTimeRegex = /Recommended Sojourn Time:\s*([^ ]*)/;

          const restaurantNameMatch = restaurantNameRegex.exec(restaurant1_);
          const summaryMatch = summaryRegex.exec(restaurant1_);
          const latitudeMatch = latitudeRegex.exec(restaurant1_);
          const longitudeMatch = longitudeRegex.exec(restaurant1_);
          const sojournTimeMatch = sojournTimeRegex.exec(restaurant1_);

          restaurant1 = {
            "Restaurant Name": restaurantNameMatch ? restaurantNameMatch[1] : null,
            "Summary": summaryMatch ? summaryMatch[1] : null,
            "Location": {
              "Latitude": latitudeMatch ? latitudeMatch[1] : null,
              "Longitude": longitudeMatch ? longitudeMatch[1] : null,
            },
            "Recommended Sojourn Time": sojournTimeMatch ? sojournTimeMatch[1] : null,
          };
        }
      };
      console.log(attraction1)
      console.log(restaurant1)
      const Itinerary = {
        'attraction1': attraction1,
        'restaurant1': restaurant1,
        // 'attraction2': attraction1,
        // 'restaurant2': restaurant1
      }
      console.log(Itinerary)

      dataStore = { 
        "destination": data.destinationValue,
        "itineraries": Itinerary,
      }

      console.log(dataStore)

      storeItinerary(dataStore)
      return attractionName1_

    } catch (err) {
      console.log(err)
    }

  },

  findItinerary: async (req, res) => {
    const { destinationValue, dayValue } = req.body;
    const durationValue = dayValue;
  
    try {
      const result = await ItineraryModel.find({ destination: destinationValue }).limit(durationValue);
      const array_length = result.length;
  
      // if arrayLength < dayValue
      if (array_length < dayValue) {
        const difference = dayValue - array_length;
        const excludeDestinations = [];
        for (const item of result) {
          try {
            const attractionName = item.itineraries[0].attraction1['Attraction Name'];
            excludeDestinations.push(attractionName);
          } catch (error) {
            console.error('Error reading attraction name:', error);
            continue; // Skip to the next iteration
          }
        }
        console.log(excludeDestinations);
        for (let i = 0; i < difference; i++) {
          // Call your function here
          // Replace the console.log statement with your function call
          newAttraction = await itineraryControllers.createItinerary({ "exclude": excludeDestinations, "destinationValue": destinationValue });
          excludeDestinations.push(newAttraction);
        }
  
        // Fetch new data after the loop and after the new data is generated
        const result_ = await ItineraryModel.find({ destination: destinationValue }).limit(dayValue);
  
        if (result_) {
          // User found
          res.json(result_);
        } else {
          // User not found
          res.status(404).json({ error: "Itinerary not found" });
        }
      } else {
        // If there are enough results, send them directly
        res.json(result);
      }
    } catch (error) {
      console.error('Error finding user:', error);
      res.status(500).json({ error: 'Fail to return the Itinerary' });
    }
  },

  keepItineraryOnly: async (req, res)  => {
    const { destinationName } = req.body;
    try {
      // Connect to MongoDB
      mongoose.connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`
      );

      // Find the itinerary with the provided destination name
      const matchingItinerary = await ItineraryModel.findOne({ destination: destinationName });

      if (!matchingItinerary) {
        // If no itinerary found with the provided destination name, return a message
        mongoose.disconnect();
        return { success: false, message: "No itinerary found with the provided destination name." };
      }

      // Delete all other itineraries with different destinations
      await ItineraryModel.deleteMany({ destination: { $ne: destinationName } });

      // Close the MongoDB connection
      mongoose.disconnect();

      // If the operation was successful, return a success message
      return { success: true, message: `Successfully kept only the itinerary with destination '${destinationName}'` };
    } catch (error) {
      console.error("Error keeping only the itinerary:", error);
      mongoose.disconnect();
      return { success: false, message: "Failed to keep only the itinerary." };
    }
  },

}

module.exports = itineraryControllers