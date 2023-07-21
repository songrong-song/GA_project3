const { date } = require('joi')
const mongoose = require('mongoose')

const userItinerarySchema = new mongoose.Schema(
    {   userId: { type: String },
        destination:  { type: String },
        itineraries: {type: Array}, },

    {
        timestamps: true
    }
)

const userItinerary = mongoose.model('UserItinerary', userItinerarySchema)

module.exports = userItinerary
