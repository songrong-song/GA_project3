const mongoose = require('mongoose');
const UserItinerary = require('../UserItineraryModel'); // Update the path accordingly
require('dotenv').config()

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
  .then(async () => {
    console.log('Seeding the database');

    // Sample seed data
    userItinerarySeedData = {
      useremail: "example@example.com",
      destination: {
        destinationName: "London",
        country: "United Kingdom"
      },
      itineraries: [
        {
          activities: ["Visit Big Ben", "Explore Westminster Abbey", "Take a Thames River Cruise"]
        },
        {
          activities: ["Visit the British Museum", "Stroll through Hyde Park", "Enjoy afternoon tea"]
        }
      ],
      timeStampOfSave: new Date()
    };
    

    // Insert seed data into the database
    const seedResult = await UserItinerary.insertMany(userItinerarySeedData);
    console.log(seedResult);

    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('Failed to seed the data:', err);
    mongoose.disconnect();
  });