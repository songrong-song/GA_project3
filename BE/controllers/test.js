const json = require('jsonfile');
const gptControllers = require("./GPT_controller.js");
const ItineraaryControllers = require("./itinerary_controller.js");

async function a(a) {
  try {


    const result = await ItineraryControllers.generateDestinationResult1(a);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

a("a")
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.error(error);
  });


