// profiles controller - viewing user's booked flights
const express = require('express');
const router = express.Router();
const Flight = require('../models/flight.js');

router.get('/', async (req, res) => {
    try {
        // get all flights the user has booked
        const myBookedFlights = await Flight.find({
            bookedByUsers: { $in: req.session.user._id },
        }).populate('owner');
        res.render('profiles/show.ejs', { myBookedFlights });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

module.exports = router;