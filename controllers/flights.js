const express = require('express');
const router = express.Router();

const Flight = require('../models/flight');

// GET - index page
router.get('/', async (req, res) => {
    try {
        const flights = await Flight.find({})
        res.render('flights/index.ejs', { flights } )
    } catch (error) {
        console.log('Error: ', error);
        res.redirect("/");
    }
})

// GET - new flight page
router.get('/new', (req, res) => {
    res.render('flights/new.ejs');
})

// POST - create flight 
router.post('/', async (req, res) => {
    try {
        const formData = req.body;
        
        // assign logged in user as owner
        formData.owner = req.session.user._id;
        
        await Flight.create(formData)
        
        res.redirect('/flights')
    } catch (error) {
        console.log('Error: ', error);
        res.redirect("/");
    }
})

// GET - show flight page
router.get('/:flightId', async (req, res) => {
    const flightId = req.params.flightId;
    const flight = await Flight.findById(flightId);

    res.render('flights/show.ejs', { flight });
})

router.delete('/:flightId', async (req, res) => {
    const flightId = req.params.flightId;
    const flight = await Flight.findById(flightId);

    if (flight.owner.equals(req.session.user._id)) {
        await flight.deleteOne();
        res.redirect('/flights');
    } else {
        res.send("You don't have permission to do that");
    }
})

// GET - edit flight page
router.get('/:flightId/edit', async (req, res) => {
    const flightId = req.params.flightId;
    const flight = await Flight.findById(flightId);
    // get date as string
    const dateString = flight.date.toISOString();
    // remove the milliseconds and timezone from the date so it can be assigned in the input field as a value
    const formattedDate = dateString.substring(0, dateString.indexOf('.'));
    // assign formattedDate to
    flight.formattedDate = formattedDate;
    res.render('flights/edit.ejs', { flight });
})

module.exports = router;