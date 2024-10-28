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

module.exports = router;