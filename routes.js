/**
 * Created by Brian on 08/07/2017.
 */
'use strict';

const express = require('express');
const router = express.Router();

const accounts = require('./controllers/accounts.js');
const dashboard = require('./controllers/dashboard.js');
const trainerDashboard = require('./controllers/trainerDashboard.js');
const member = require('.');
const about = require('./controllers/about.js');

router.get('/', accounts.index);
router.get('/login', accounts.login);
router.get('/signup', accounts.signup);
router.get('/logout', accounts.logout);
router.get('/about', about.index);
router.get('/dashboard', dashboard.index);
router.get('/dashboard/removeAssessment/:assessmentId', dashboard.removeAssessment);
router.get('/trainerDashboard', trainerDashboard.index);
router.get('/trainerDashboard/deleteMember/:id', trainerDashboard.removeMember);
router.get('/trainerDashboard/viewMemberAssessments/:id', trainerDashboard.viewMemberAssessments);

router.post('/register', accounts.register);
router.post('/authenticate', accounts.authenticate);
router.post('/dashboard/addassessment', dashboard.addAssessment);

module.exports = router;
