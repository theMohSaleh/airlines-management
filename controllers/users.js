// users controller - viewing and managing users (ADMIN)
const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

router.get('/', async (req, res) => {
    try {
        const users = await User.find({});
        res.render('users/index.ejs', { users });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
})

router.post('/:idOfUser/adminRole', async (req, res) => {
    try {
        const paramUserId = req.params.idOfUser;
        const userFound = await User.findById(paramUserId);
        
        userFound.isAdmin = true;
        await userFound.save();
        res.redirect('/users')        
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
})

router.delete('/:userId/adminRole', async (req, res) => {
    try {
        const userId = req.params.userId;
        if (req.session.user._id === userId) {
            res.send('Cannot remove own admin privilege')
            return;
        }
        const user = await User.findById({_id: userId});
        user.isAdmin = false;
        await user.save();
        res.redirect('/users')        
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
})

module.exports = router;