const Joi = require("joi")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const itenaryModel = require("../models/ItineraryModel")
const userValidators = require("./validators/userValidator")
const gptControllers = require("./GPT_controller.js")
const ItineraryModel = require("../models/ItineraryModel")
const mongoose = require('mongoose');




const itineraryControllers = {
 
    createItinerary: async (data) => {

        const storeItinerary = async (input) => {
          console.log("passed item")
          console.log(input)
          const data = [input]
          mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
          .then(async () => {
            const Result = await ItineraryModel.insertMany(data);
            console.log(Result);})
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
              [attraction1_, attractionName1_] = await gptControllers.generateDestinationResult1(data.destinationValue,data.exclude);
              console.log(attraction1_)
            } catch (error) {
              attraction1_ = null;
              attractionName1_ = null;
            }
            
            // try {
            //   [attraction2_, attractionName2_] = await gptControllers.generateDestinationResult2(data.destinationValue, attractionName1_);
  
            //   console.log(attraction2_)
            // } catch (error) {
            //   attraction2_ = null;
            //   attractionName2_ = null;
            // }
            
            try {
              restaurant1_ = await gptControllers.generateRestaurantResult(attractionName1_);
            } catch (error) {
              restaurant1_ = null;
            }
            
            // try {
            //   restaurant2_ = await gptControllers.generateRestaurantResult(attractionName2_);
            // } catch (error) {
            //   restaurant2_ = null;
            // }

            // var attraction1 = attraction1_!== null ? {
            //     "Attraction Name": attraction1_.match(/"Attraction Name":\s*"([^"]*)"/)? attraction1_.match(/"Attraction Name":\s*"([^"]*)"/)[1]: null,
            //     "Summary": attraction1_.match(/"Summary":\s*"([^"]*)"/)?attraction1_.match(/"Summary":\s*"([^"]*)"/)[1]:null,
            //     "Location": {"Latitude": attraction1_.match(/"Latitude":\s*"([^"]*)"/)?attraction1_.match(/"Latitude":\s*"([^"]*)"/)[1]:null,
            //                 "Longitude": attraction1_.match(/"Longitude":\s*"([^"]*)"/)?attraction1_.match(/"Longitude":\s*"([^"]*)"/)[1]:null,},

            //     // "Location":attraction1_.match(/"Location":\s*"([^"]*)"/)?attraction1_.match(/"Summary":\s*"([^"]*)"/)[1]:null,

            //     "Recommended Sojourn Time": attraction1_.match(/"Recommended Sojourn Time":\s*"([^"]*)"/)?[1]:null,
            // } : null;


            // var attraction2 = attraction2_!== null ? {
            //     "Attraction Name": attraction2_.match(/"Attraction Name":\s*"([^"]*)"/)? attraction2_.match(/"Attraction Name":\s*"([^"]*)"/)[1]: null,
            //     "Summary": attraction2_.match(/"Summary":\s*"([^"]*)"/)?attraction2_.match(/"Summary":\s*"([^"]*)"/)[1]:null,
            //     // "Location": {"Latitude": attraction2_.match(/"Latitude":\s*"([^"]*)"/)?attraction2_.match(/"Latitude":\s*"([^"]*)"/)[1]:null,
            //     //               "Longitude": attraction2_.match(/"Longitude":\s*"([^"]*)"/)?attraction2_.match(/"Longitude":\s*"([^"]*)"/)[1]:null,},
            //     "Location":attraction2_.match(/"Location":\s*"([^"]*)"/)?attraction1_.match(/"Summary":\s*"([^"]*)"/)[1]:null,
            //     "Recommended Sojourn Time": attraction2_.match(/"Recommended Sojourn Time":\s*"([^"]*)"/)?[1]:null,
            // } : null;


 
            // restaurant2 = restaurant2_!== null ? {
            //     "Restaurant Name": restaurant2_.match(/"Restaurant Name":\s*"([^"]*)"/)?restaurant2_.match(/"Restaurant Name":\s*"([^"]*)"/)[1]:null,
            //     "Summary": restaurant2_.match(/"Summary":\s*"([^"]*)"/)? restaurant2_.match(/"Summary":\s*"([^"]*)"/)[1]:null,
            //     // "Location": {"Latitude": restaurant2_.match(/"Latitude":\s*"([^"]*)"/)?restaurant2_.match(/"Latitude":\s*"([^"]*)"/)[1]:null,
            //     // "Longitude": restauran2_.match(/"Longitude":\s*"([^"]*)"/)?restaurant2_.match(/"Longitude":\s*"([^"]*)"/)[1]:null,},
            //     "Location":restaurant2_.match(/"Location":\s*"([^"]*)"/)?attraction1_.match(/"Summary":\s*"([^"]*)"/)[1]:null,
            //     "Recommended Sojourn Time": restaurant2_.match(/"Recommended Sojourn Time":\s*"([^"]*)"/)?restaurant2_.match(/"Recommended Sojourn Time":\s*"([^"]*)"/)[1]:null,
            // } : null;
            
            console.log("attraction1_:")
            console.log(attraction1_)
            // console.log(restaurant1_)


            try {var attraction1 = JSON.parse(attraction1_);
              
            } catch (error) {
                console.log(error)
                var attraction1 = attraction1_!== null ? {
                "Attraction Name": attraction1_.match(/"Attraction Name":\s*"([^"]*)"/)? attraction1_.match(/"Attraction Name":\s*"([^"]*)"/)[1]: null,
                "Summary": attraction1_.match(/"Summary":\s*"([^"]*)"/)?attraction1_.match(/"Summary":\s*"([^"]*)"/)[1]:null,
                "Location": {"Latitude": attraction1_.match(/"[Ll]atitude":\s*"([^"]*)"/)?attraction1_.match(/"Latitude":\s*"([^"]*)"/)[1]:null,
                            "Longitude": attraction1_.match(/"[Ll]ongitude":\s*"([^"]*)"/)?attraction1_.match(/"Longitude":\s*"([^"]*)"/)[1]:null,},

                // "Location":attraction1_.match(/"Location":\s*"([^"]*)"/)?attraction1_.match(/"Summary":\s*"([^"]*)"/)[1]:null,

                "Recommended Sojourn Time": attraction1_.match(/"Recommended Sojourn Time":\s*"([^"]*)"/)?[1]:null,
               } : null;
              
            }

            console.log("Attraction1:")
            console.log(attraction1)

            try {var restaurant1 = JSON.parse(restaurant1_);
              
            } catch (error) {
                console.log(error)
                var restaurant1 = restaurant1_!== null ? {
                "Restaurant Name": restaurant1_.match(/"Restaurant Name":\s*"([^"]*)"/)? restaurant1_.match(/"Restaurant Name":\s*"([^"]*)"/)[1]: null,
                "Summary": restaurant1_.match(/"Summary":\s*"([^"]*)"/)? restaurant1_.match(/"Summary":\s*"([^"]*)"/)[1]:null,
                "Location": {"Latitude": restaurant1_.match(/"[Ll]atitude":\s*"([^"]*)"/)? restaurant1_.match(/"Latitude":\s*"([^"]*)"/)[1]:null,
                             "Longitude": restaurant1_.match(/"[Ll]ongitude":\s*"([^"]*)"/)? restaurant1_.match(/"Longitude":\s*"([^"]*)"/)[1]:null,},

                // "Location":attraction1_.match(/"Location":\s*"([^"]*)"/)?attraction1_.match(/"Summary":\s*"([^"]*)"/)[1]:null,

                "Recommended Sojourn Time":  restaurant1_.match(/"Recommended Sojourn Time":\s*"([^"]*)"/)?[1]:null,
               } : null;
              
            }

            // const restaurant1 = restaurant1_?JSON.parse(restaurant1_):null;

            // attraction2 = attraction2_?JSON.parse(attraction2_):null
            // restaurant2 = restaurant2_?JSON.parse(restaurant2_):null
            console.log(attraction1)
            console.log(restaurant1)
            const Itinerary = {
            'attraction1': attraction1,
            'restaurant1': restaurant1,
            // 'attraction2': attraction1,
            // 'restaurant2': restaurant1
          }
            console.log("check1")
            console.log(Itinerary)

            dataStore = {
              "destination":data.destinationValue,
              "itineraries": Itinerary,
            }

            console.log(dataStore)

            storeItinerary(dataStore)
            return attractionName1_

        } catch(err) {
          console.log(err)
        }
   
    },

    findItinerary: async (req, res) => {
      console.log(req.body)
      const {destinationValue, dayValue} = req.body;
      const durationValue = dayValue;
  
      try {
        const result = await ItineraryModel.find({ destination: destinationValue }).limit(durationValue);
        const array_length = result.length;
    
        // if arrayLength < dayValue
        if (array_length  < dayValue) {
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
          console.log(excludeDestinations)
          for (let i = 0; i < difference; i++) {
  
            // Call your function here
            // Replace the console.log statement with your function call
            console.log(result)
            newAttraction = this.createItinerary(data = {"exclude": excludeDestinations, "destinationValue":destinationValue })
            excludeDestinations.push(newAttraction)
            console.log(newAttraction)
          }
        }
  
        const result_ = await ItineraryModel.find({ destination: destinationValue }).limit(dayValue);
        
  
        if (result_) {
          // User found
          res.json(result_);
        } else {
          // User not found
          res.status(404).json({ error: "Itinerary not found" });
        }
      } catch (error) {
        console.error('Error finding user:', error);
        res.status(500).json({ error: 'Fail to return the Itinerary' });
      }
    },
  




  }

module.exports = itineraryControllers