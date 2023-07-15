const Joi = require("joi")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const itenaryModel = require("../models/ItineraryModel")
const userValidators = require("./validators/userValidator")
const gptControllers = require("./GPT_controller.js")
const ItineraryModel = require("../models/ItineraryModel")

const itineraryControllers = {
  

    createItinerary: async (req, res) => {

        storeItierary_ = async (data) => {
            try {
                console.log("here")
                await ItineraryModel.create({
                    User: data.User,
                    Destination: data.destinationValue,
                    Itinerary: data.Itinerary,
                });
            } catch (err) {
                console.log(err);
                throw new Error("Failed to create itinerary");
            }
        },

        // get the registration data in the req
        data = req.body
        // generate the ChatGPT result
        try {
            
            if (!data.hasOwnProperty('destinationValue') || data.destinationValue === '') {
                const destinations = ['New York', 'Paris', 'Tokyo', 'London'];
                const randomIndex = Math.floor(Math.random() * destinations.length);
                data.destinationValue = destinations[randomIndex];
            }
            
            let attraction1_, attractionName1_, attraction2_, attractionName2_, restaurant1_, restaurant2_;

            try {
              [attraction1_, attractionName1_] = await gptControllers.generateDestinationResult1(data.destinationValue);
            } catch (error) {
              attraction1_ = null;
              attractionName1_ = null;
            }
            
            try {
              [attraction2_, attractionName2_] = await gptControllers.generateDestinationResult2(data.destinationValue, attractionName1_);
            } catch (error) {
              attraction2_ = null;
              attractionName2_ = null;
            }
            
            try {
              restaurant1_ = await gptControllers.generateRestaurantResult(attractionName1_);
            } catch (error) {
              restaurant1_ = null;
            }
            
            try {
              restaurant2_ = await gptControllers.generateRestaurantResult(attractionName2_);
            } catch (error) {
              restaurant2_ = null;
            }

            var attraction1 = attraction1_!== null ? {
                "Attraction Name": attraction1_.match(/"Attraction Name":\s*"([^"]*)"/)? attraction1_.match(/"Attraction Name":\s*"([^"]*)"/)[1]: null,
                "Summary": attraction1_.match(/"Summary":\s*"([^"]*)"/)?attraction1_.match(/"Summary":\s*"([^"]*)"/)[1]:null,
                "Location": attraction1_.match(/"Location":\s*"([^"]*)"/)?attraction1_.match(/"Summary":\s*"([^"]*)"/)[1]:null,
                "Recommended Sojourn Time": attraction1_.match(/"Recommended Sojourn Time":\s*"([^"]*)"/)?[1]:null,
            } : null;


            var attraction2 = attraction2_!== null ? {
                "Attraction Name": attraction2_.match(/"Attraction Name":\s*"([^"]*)"/)? attraction2_.match(/"Attraction Name":\s*"([^"]*)"/)[1]: null,
                "Summary": attraction2_.match(/"Summary":\s*"([^"]*)"/)?attraction2_.match(/"Summary":\s*"([^"]*)"/)[1]:null,
                "Location": attraction2_.match(/"Location":\s*"([^"]*)"/)?attraction2_.match(/"Summary":\s*"([^"]*)"/)[1]:null,
                "Recommended Sojourn Time": attraction2_.match(/"Recommended Sojourn Time":\s*"([^"]*)"/)?[1]:null,
            } : null;

            restaurant1 = restaurant1_? 
            {
                "Restaurant Name": restaurant1_.match(/"Attraction Name":\s*"([^"]*)"/)?restaurant1_.match(/"Attraction Name":\s*"([^"]*)"/)[1]:null,
                "Summary": restaurant1_.match(/"Summary":\s*"([^"]*)"/)? restaurant1_.match(/"Summary":\s*"([^"]*)"/)[1]:null,
                "Location": restaurant1_.match(/"Location":\s*"([^"]*)"/)? restaurant1_.match(/"Location":\s*"([^"]*)"/)[1]:null,
                "Recommended Sojourn Time": restaurant1_.match(/"Recommended Sojourn Time":\s*"([^"]*)"/)?restaurant1_.match(/"Recommended Sojourn Time":\s*"([^"]*)"/)[1]:null,
            } : null

 
            restaurant2 = restaurant2_? 
            {
                "Restaurant Name": restaurant2_.match(/"Attraction Name":\s*"([^"]*)"/)?restaurant2_.match(/"Attraction Name":\s*"([^"]*)"/)[1]:null,
                "Summary": restaurant2_.match(/"Summary":\s*"([^"]*)"/)? restaurant2_.match(/"Summary":\s*"([^"]*)"/)[1]:null,
                "Location": restaurant2_.match(/"Location":\s*"([^"]*)"/)? restaurant2_.match(/"Location":\s*"([^"]*)"/)[1]:null,
                "Recommended Sojourn Time": restaurant2_.match(/"Recommended Sojourn Time":\s*"([^"]*)"/)?restaurant2_.match(/"Recommended Sojourn Time":\s*"([^"]*)"/)[1]:null,
            } : null


            Itinerary = {'attraction1': attraction1?attraction1:null,
            'attraction2': attraction2?attraction2:null, 
            'restaurant1': restaurant1?restaurant1:null,
            'restaurant2': restaurant2?restaurant2:null }


            storeData = 
            {   "User": "",
                "Desination":data.destinationValue,
                "Itinerary": Itinerary
            };

            storeItierary_(storeData)
         
            // Code to handle the successful result1
            return res.json({
                storeData
            });

        } catch(err) {
            res.statusCode = 500;
            return res.json({
                msg: "failed to create user",
                error: err.message
            });
        }
   
    },

}

module.exports = itineraryControllers