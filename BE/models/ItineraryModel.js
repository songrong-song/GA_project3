const mongoose = require('mongoose')

const itinerarySchema = new mongoose.Schema(
    {   username: { type: String },
        day: {type: String},
        destination1:  { type: Object },
	    attraction1:  { type: Object },
        attraction2: { type: Object},
        restination1: { type: Object},
        restination2: { type: Object},
    },
    {
        timestamps: true
    }
)

const Itenary = mongoose.model('Itinerary', itinerarySchema)

module.exports = Itenary
