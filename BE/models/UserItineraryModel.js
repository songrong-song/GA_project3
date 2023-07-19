const { date } = require('joi')
const mongoose = require('mongoose')

const itinerarySchema = new mongoose.Schema(
    {   userEmail: { type: String },
        destination:  { type: Object },
        itineraries: {type: Array},
        timeStampWhenSave: {type: date} },

    {
        timestamps: true
    }
)

const Itenary = mongoose.model('UserItinerary', itinerarySchema)

module.exports = Itenary
