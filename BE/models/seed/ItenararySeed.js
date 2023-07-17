const mongoose = require('mongoose');
const Itinerary = require('../ItineraryModel'); // Update the path accordingly
require('dotenv').config()
const itinerarySeedData = require('./TourItinenary.itineraries.json')

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
  .then(async () => {
    console.log('Seeding the database');

    // Sample seed data

    // Insert seed data into the database
    const seedResult = await Itinerary.insertMany(itinerarySeedData);
    console.log(seedResult);

    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('Failed to seed the data:', err);
    mongoose.disconnect();
  });