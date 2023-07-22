const axios = require('axios');
const { MongoClient } = require('mongodb');
const CircularJSON = require('circular-json');
// const GPTValidators = require("./validators/GPTValidator")
require('dotenv').config()
const gptControllers = {

  apiKey: process.env.API_KEY,
  apiUrl: process.env.API_URL,


  generateDestinationPrompt1: async function(destinationValue, excludeValue = []) {

    let prompt = `Generate recommended attraction on below information for ${destinationValue} that is not one of the attraction here: ${excludeValue.join(', ')}. For the result, please strictly following the JSON format:
    - Attraction Name: 
    - Summary: 
    - Location:
      - Latitude: 
      - Longitude: 
    - Recommended Sojourn Time (number of hour only):
     `
    return prompt;
  },

  generateRestaurantPrompt: async function(attractionValue) {
    console.log(this.apiKey)
    let prompt = `Generate recommended restaurant on below information that near ${attractionValue}, strictly following the JSON format:
    - Restaurant Name: 
    - Summary: 
    - Location:
      - Latitude: 
      - Longitude: 
    - Recommended Sojourn Time (number of hour only): 
     `
    return prompt;
  },

  generateDestinationResult1: async function(destinationValue, excludeValue) {
    console.log("test")
    console.log(process.env.API_KEY)
    try {
      const prompt = await this.generateDestinationPrompt1(destinationValue = destinationValue, excludeValue = excludeValue);
      console.log(prompt)
      const result = await axios.post(
        this.apiUrl,
        {
          model: 'text-davinci-003',
          prompt: prompt,
          max_tokens: 100,
          temperature: 0.7,
          n: 1,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        }

      );

      const completion_ = await result.data.choices[0].text.trim();
      console.log(completion_)
      const attractionNameRegex = /Attraction Name:\s*([^]*)/;
      const match = completion_.match(attractionNameRegex);
      const attractionName = match ? match[1].trim() : "not available";
      return [completion_, attractionName];

    } catch (error) {
      console.error('Error generating API result:', error);
      throw error;
    }
  },


  generateRestaurantResult: async function(attractionName) {
    try {
      const prompt = await this.generateRestaurantPrompt(attractionName);
      const response = await axios.post(
        this.apiUrl,
        {
          model: 'text-davinci-003',
          prompt: prompt,
          max_tokens: 100,
          temperature: 0.7,
          n: 1,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        }

      );

      const completion = response.data.choices[0].text.trim();
      return completion;
    } catch (error) {
      console.error('Error generating API result:', error);
      throw error;
    }
  },


  // processResult: async function(result) {
  // }  

};

module.exports = gptControllers;