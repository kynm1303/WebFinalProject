const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');

const userModel = require('../models/user.model');
const auth = require('../middlewares/auth.mdw');

const router = express.Router();

router.get('/profile', auth, function(req, res) {
    res.render('vwAccount/profile');
});

router.get('/register', function(req, res) {
    res.render('vwAccount/register');
})

router.post('/register', async function(req, res) {
    const hash = bcrypt.hashSync(req.body.raw_password, 10);
    const dob = moment(req.body.raw_dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
    const user = {
        Username: req.body.username,
        Password: hash,
        DOB: dob,
        Name: req.body.name,
        Email: req.body.email,
        Permission: 0,
        Avatar: 'https://cdn3.iconfinder.com/data/icons/avatars-round-flat/33/avat-01-512.png',
    }

    await userModel.add(user);
    res.render('vwAccount/register');
})

router.get('/is-available', async function(req, res) {
    const username = req.query.user;
    const user = await userModel.findByUsername(username);
    if (user === null) {
        return res.json(true);
    }

    res.json(false);
})

router.get('/login', async function(req, res) {
    res.render('vwAccount/login', {
        layout: false
    });
});

router.post('/login', async function(req, res) {
    const user = await userModel.findByUsername(req.body.username);
    if (user === null) {
        return res.render('vwAccount/login', {
            layout: false,
            err_message: 'Invalid username!'
        })
    }

    const ret = bcrypt.compareSync(req.body.password, user.Password);
    if (ret === false) {
        return res.render('vwAccount/login', {
            layout: false,
            err_message: 'Invalid password!'
        })
    }

    delete user.Password;
    delete user.Permission;
    req.session.isWriter = (user.PenName != null);
    req.session.auth = true;
    req.session.authUser = user;
    const url = req.session.retUrl || '/';
    res.redirect(url);
})

router.post('/logout', auth, async function(req, res) {
    req.session.auth = false;
    req.session.authUser = null;
    req.session.retUrl = '';
    const url = req.headers.referer || '/';
    res.redirect(url);
})

module.exports = router;