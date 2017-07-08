/**
 * Created by Brian on 08/07/2017.
 */
'use strict';

const express = require('express');
const router = express.Router();

const accounts = require('./controllers/accounts.js');
const dashboard = require('./controllers/dashboard.js');

router.get('/', accounts.index);
router.get('/login', accounts.login);
router.get('/signup', accounts.signup);
router.get('/logout', accounts.logout);
router.get('/about', about.index);

router.post('/register', accounts.register);
router.post('/authenticate', accounts.authenticate);

module.exports = router;