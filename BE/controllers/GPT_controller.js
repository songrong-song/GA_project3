const axios = require('axios');
const { MongoClient } = require('mongodb');
const CircularJSON = require('circular-json');
// const GPTValidators = require("./validators/GPTValidator")
require('dotenv').config()
const gptControllers = {


  apiKey: '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', // Replace 'YOUR_API_KEY' with your actual OpenAI API key
  apiUrl: 'https://api.openai.com/v1/completions',


  generateDetinationPrompt_Final: async function(destinationValue) {

    let prompt = `Generate recommended attraction on below information for ${destinationValue} following the JSON format:
    - Summary: 
    - Location:
      - Latitude: 
      - Longitude: 
    - Recommended Sojourn Time (number of hour only):
    - Nearby Restaurant
    - Nearby Restaurant Location: 
      - Latitude: 
      - Longitude: `

    return prompt;
  },

  generateResult_Final: async function(destinationValue) {
    try {
      const prompt = await this.generateDetinationPrompt_Final(destinationValue);
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


  generateDestinationPrompt1: async function(destinationValue, excludeValue = []) {

    let prompt = `Generate recommended attraction on below information for ${destinationValue} that is not ${excludeValue.join(' and not ')}, strictly following the JSON format:
    - Attraction Name: 
    - Summary: 
    - Location:
      - Latitude: 
      - Longitude: 
    - Recommended Sojourn Time (number of hour only):
     `
    return prompt;
  },

  generateDestinationPrompt2: async function(destinationValue, excludeValue) {
    let prompt = `Generate recommended attraction on below information for ${destinationValue} thats is not ${excludeValue}, strictly following the JSON format:
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
      // completion  = CircularJSON.stringify(completion_)
      // completion = JSON.parse(completion_)
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

  generateDestinationResult2: async function(destinationValue, excludeValue) {
    try {
      const prompt = await this.generateDestinationPrompt2(destinationValue, excludeValue);
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

      const completion = result.data.choices[0].text.trim();
      let attractionName = completion["Attraction Name"]
      return [completion, attractionName];

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