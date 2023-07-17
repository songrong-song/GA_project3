const mongoose = require('mongoose');
const Itinerary = require('../ItineraryModel'); // Update the path accordingly
require('dotenv').config()

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
  .then(async () => {
    console.log('Seeding the database');

    // Sample seed data
    const itinerarySeedData = [
      {
        username: 'user1',
        days: '1',        
        destination: 'Country 1',
        itenaries: [
          {
            attraction1: { name: 'Attraction 1', location: 'Location 1' },
            attraction2: { name: 'Attraction 2', location: 'Location 2' },
            restination1: { name: 'Restination 1', location: 'Location 3' },
            restination2: { name: 'Restination 2', location: 'Location 4' }
          }
        ]
      },
      // Add more itinerary objects as needed
    ];


    

    // Insert seed data into the database
    const seedResult = await Itinerary.insertMany(itinerarySeedData);
    console.log(seedResult);

    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('Failed to seed the data:', err);
    mongoose.disconnect();
  });