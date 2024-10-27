const express = require('express');
const router = express.Router();

const Flight = require('../models/flight');

// GET - index page
router.get('/', async (req, res) => {
    try {
        const flights = Flight.find({})
        res.render('flights/index.ejs', flights)
    } catch (error) {
        console.log('Error: ', error);
        res.redirect("/");
    }
})



module.exports = router;