const { date } = require('joi')
const mongoose = require('mongoose')

const userItinerarySchema = new mongoose.Schema(
    {   userID: { type: String },
        dayValue: { type: String },
        destination:  { type: String },
        itineraries: {type: Array}, },

    {
        timestamps: true
    }
)

const userItinerary = mongoose.model('UserItinerary', userItinerarySchema)

module.exports = userItinerary


