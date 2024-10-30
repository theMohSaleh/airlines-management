// flights controller - handle creating, editing and removing flights. Also handle booking flights or cancel booking
const express = require('express');
const axios = require('axios');
const router = express.Router();
const { formatISO } = require('date-fns');

const Flight = require('../models/flight');

// GET - index page
router.get('/', async (req, res) => {
    try {
        const flights = await Flight.find({})
        res.render('flights/index.ejs', { flights })
    } catch (error) {
        console.log('Error: ', error);
        res.render('errors/notFound.ejs')
    }
})

// GET - new flight page (ADMIN)
router.get('/new', async (req, res) => {
    // if user is not admin, redirect to home page and stop process
    if (isAdminUser(req.session.user) === false) {
        res.render('errors/notFound.ejs');
        return;
    }

    res.render('flights/new.ejs');
})

// POST - create flight (ADMIN)
router.post('/', async (req, res) => {
    // if user is not admin, redirect to home page and stop process
    if (isAdminUser(req.session.user) === false) {
        res.render('errors/notFound.ejs');
        return;
    }
    try {
        const formData = req.body;

        // assign logged in user as owner
        formData.owner = req.session.user._id;

        await Flight.create(formData)

        res.redirect('/flights')
    } catch (error) {
        console.log('Error: ', error);
        res.render('errors/notFound.ejs')
    }
})

// GET - show flight page
router.get('/:flightId', async (req, res) => {
    try {
        const flightId = req.params.flightId;
        const flight = await Flight.findById(flightId);

        const userHasBooked = flight.bookedByUsers.some((user) =>
            user.equals(req.session.user._id)
        );
        res.render('flights/show.ejs', { flight, userHasBooked });
    } catch (error) {
        console.log(error);
        res.render('errors/notFound.ejs')
    }
})

// DELETE - remove flight (ADMIN)
router.delete('/:flightId', async (req, res) => {
    // if user is not admin, redirect to home page and stop process
    if (isAdminUser(req.session.user) === false) {
        res.render('errors/notFound.ejs');
        return;
    }
    const flightId = req.params.flightId;
    const flight = await Flight.findById(flightId);

    await flight.deleteOne();
    res.redirect('/flights');

})

// GET - edit flight page (ADMIN)
router.get('/:flightId/edit', async (req, res) => {
    // if user is not admin, redirect to home page and stop process
    if (isAdminUser(req.session.user) === false) {
        res.render('errors/notFound.ejs');
        return;
    }
    const flightId = req.params.flightId;
    const flight = await Flight.findById(flightId);
    // get date as string
    const dateString = formatISO(flight.date);

    // remove the milliseconds and timezone from the date so it can be assigned in the input field as a value
    const formattedDate = dateString.substring(0, dateString.indexOf(':00+03:00'));

    // assign formattedDate to flight variable
    flight.formattedDate = formattedDate;
    res.render('flights/edit.ejs', { flight });
})

// PUT - update flight details (ADMIN)
router.put('/:flightId', async (req, res) => {
    // if user is not admin, redirect to home page and stop process
    if (isAdminUser(req.session.user) === false) {
        res.render('errors/notFound.ejs');
        return;
    }
    try {
        const flight = await Flight.findById(req.params.flightId);
            await flight.updateOne(req.body)
            res.redirect('/flights')

    } catch (error) {
        console.log(error);
        res.render('errors/notFound.ejs')
    }
});

// POST - book flight for user
router.post('/:flightId/booked-by/:userId', async (req, res) => {
    try {
        const flightId = req.params.flightId;
        const userId = req.params.userId;
        const flight = await Flight.findById(flightId)
        // check if any remaining seats are available
        if (flight.capacity - flight.bookedByUsers.length > 0) {
            // add user to booking list
            flight.bookedByUsers.push(userId);
            await flight.save();
            res.redirect(`/flights/${req.params.flightId}`);
        } else {
            // send error message if user tries to book a booked flight
            res.send('This operation is no longer valid.')
        }
    } catch (error) {
        console.log(error);
        res.render('errors/notFound.ejs');
    }
});

// DELETE - remove booking for user
router.delete('/:flightId/booked-by/:userId', async (req, res) => {
    try {
        await Flight.findByIdAndUpdate(req.params.flightId, {
            $pull: { bookedByUsers: req.params.userId },
        });
        res.redirect(`/flights/${req.params.flightId}`);
    } catch (error) {
        console.log(error);
        res.render('errors/notFound.ejs')
    }
});

// function to check if user is admin
function isAdminUser(user) {
    if (user.isAdmin === false) {
        return false;
    }
}

module.exports = router;