const mongoose = require('mongoose')

const itinerarySchema = new mongoose.Schema(
    {   username: { type: String },
        destination:  { type: Object },
        days: { type: String },
        itineraries: {type: Array},},

    {
        timestamps: true
    }
)

const Itenary = mongoose.model('Itinerary', itinerarySchema)

module.exports = Itenary
