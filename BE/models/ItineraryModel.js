const mongoose = require('mongoose')

const itinerarySchema = new mongoose.Schema(
    {   
        destination:  { type: Object },
        itineraries: {type: Array},},

    {
        timestamps: true
    }
)

const Itenary = mongoose.model('Itinerary', itinerarySchema)

module.exports = Itenary
