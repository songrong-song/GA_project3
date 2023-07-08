const axios = require('axios');
const { MongoClient } = require('mongodb');
const GPTValidators = require("./validators/GPTValidator")

const gptControllers = {
  apiKey: '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', // Replace 'YOUR_API_KEY' with your actual OpenAI API key
  apiUrl: 'https://api.openai.com/v1/completions',
  mongoUrl: 'mongodb://localhost:27017',
  dbName: 'Itenary',
  collectionName: 'user-prompts',

  generateDestinationPrompt1: async function(destinationValue) {
    let prompt = `Generate recommended attraction on below information for ${destinationValue} following the JSON format:
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
    let prompt = `Generate recommended attraction on below information for ${destinationValue} thats is not ${excludeValue} following the JSON format:
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
    let prompt = `Generate recommended restaurant on below information that near ${attractionValue} following the JSON format:
    - Restaurant Name: 
    - Summary: 
    - Location:
      - Latitude: 
      - Longitude: 
    - Recommended Sojourn Time (number of hour only): 
     `
    return prompt;
  },

  generateDestinationResult1: async function(destinationValue) {
    try {
      const prompt = await this.generateDestinationPrompt1(destinationValue);
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
      console.log(completion);
      let attractionName = completion["Attraction Name"]
      return [completion, attractionName];

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
      // console.log('API Result:', completion);
      return completion;
    } catch (error) {
      console.error('Error generating API result:', error);
      throw error;
    }
  },


  storeResultInDatabase: async function(result) {
    try {
      const client = new MongoClient(this.mongoUrl);
      await client.connect();
      const db = client.db(this.dbName);
      const collection = db.collection(this.collectionName);

      // Insert the result into the collection
      await collection.insertOne({ result });

      // Close the database connection
      client.close();
      console.log('API result stored in database successfully.');
    } catch (error) {
      console.error('Error storing API result in database:', error);
      throw error;
    }
  },

  // processResult: async function(result) {
 

  // }  

};

module.exports = gptControllers;