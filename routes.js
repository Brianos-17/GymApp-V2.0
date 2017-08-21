/**
 * Created by Brian on 08/07/2017.
 */
'use strict';

const express = require('express');
const router = express.Router();

const accounts = require('./controllers/accounts.js');
const dashboard = require('./controllers/dashboard.js');
const trainerDashboard = require('./controllers/trainerDashboard.js');
const about = require('./controllers/about.js');

router.get('/', accounts.index);
router.get('/login', accounts.login);
router.get('/signup', accounts.signup);
router.get('/logout', accounts.logout);
router.get('/about', about.index);
router.get('/dashboard', dashboard.index);
router.get('/account', dashboard.account);
router.get('/memberClasses', dashboard.showClasses);
router.get('/trainerClasses', trainerDashboard.showClasses);
router.get('/memberBookings', dashboard.booking);
router.get('/trainerBookings', trainerDashboard.booking);
router.get('/goals', dashboard.showGoals);
router.get('/trainerGoals', trainerDashboard.goals);

router.get('/dashboard/removeAssessment/:assessmentId', dashboard.removeAssessment);
router.get('/trainerDashboard/:id/removeAssessment/:assessmentId', trainerDashboard.removeAssessment);
router.get('/trainerDashboard', trainerDashboard.index);
router.get('/trainerDashboard/deleteMember/:id', trainerDashboard.removeMember);
router.get('/trainerDashboard/viewMemberAssessments/:id', trainerDashboard.viewMemberAssessments);
router.get('/trainerDashboard/removeClass/:classId', trainerDashboard.removeClass);
router.get('/trainerDashboard/updateClass/:classId', trainerDashboard.updateClass);
router.get('/dashboard/enroll/:classId', dashboard.classEnrollment);
router.get('/dashboard/:classId/enroll/:sessionId', dashboard.enrollInClass);
router.get('/dashboard/:classId/enrollAll', dashboard.enrollAll);
router.get('/dashboard/unEnroll/:classId', dashboard.classUnenrollment);
router.get('/dashboard/removeBooking/:bookingId', dashboard.removeBooking);
router.get('/dashboard/updateBooking/:bookingId', dashboard.updateBooking);
router.get('/trainerDashboard/removeBooking/:bookingId', trainerDashboard.removeBooking);
router.get('/trainerDashboard/updateBooking/:bookingId', trainerDashboard.updateBooking);
router.get('/dashboard/removeGoal/:goalId', dashboard.removeGoal);

router.post('/register', accounts.register);
router.post('/authenticate', accounts.authenticate);
router.post('/dashboard/addassessment', dashboard.addAssessment);
router.post('/memberAssessment/:id/updateComment/:assessmentId', trainerDashboard.updateComment);
router.post('/updateProfile', dashboard.updateProfile);
router.post('/trainerDashboard/addNewClass', trainerDashboard.addNewClass);
router.post('/trainerDashboard/editClass/:classId', trainerDashboard.editClass);
router.post('/dashboard/addNewBooking', dashboard.addNewBooking);
router.post('/dashboard/editBooking/:bookingId', dashboard.editBooking);
router.post('/trainerDashboard/addNewBooking', trainerDashboard.addNewBooking);
router.post('/trainerDashboard/editBooking/:bookingId', trainerDashboard.editBooking);
router.post('/dashboard/addNewGoal', dashboard.addNewGoal);
router.post('/trainerDashboard/addNewGoal', trainerDashboard.addNewGoal);

module.exports = router;
