const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
    departure: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    bookedByUsers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
});

const Flight = mongoose.model("Flight", flightSchema);

module.exports = Flight;