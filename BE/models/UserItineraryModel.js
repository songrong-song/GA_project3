const { date } = require('joi')
const mongoose = require('mongoose')

const userItinerarySchema = new mongoose.Schema(
    {   userEmail: { type: String },
        destination:  { type: String },
        itineraries: {type: Array},
        timeStampWhenSave: {type: Date} },

    {
        timestamps: true
    }
)

const userItinerary = mongoose.model('UserItinerary', userItinerarySchema)

module.exports = userItinerary
