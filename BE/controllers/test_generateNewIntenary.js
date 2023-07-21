const json = require('jsonfile');
const gptControllers = require("./GPT_controller.js");
// const ItineraaryControllers = require("./itinerary_controller.js");
const GPT_controllers = require("./GPT_controller.js");
const iti_Controllers = require("./itinerary_controller.js");

async function a() {
  try {

    const result = await GPT_controllers.generateDestinationResult1("London", excludeDestinations = ["Tower of London"]);

    console.log("exam the result")
    console.log(result)
  } catch (error) {
    console.error(error);
    throw error;
  }
}

a()