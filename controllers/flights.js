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

router.get('/new', (req, res) => {
    res.render('flights/new.ejs');
})

module.exports = router;