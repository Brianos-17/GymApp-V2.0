/**
 * Created by Brian on 15/07/2017.
 */
'use strict';

const logger = require('../utils/logger.js');
const accounts = require('./accounts.js');
const members = require('../models/members-store.json');

const trainerDashboard = {
  index(request, response) {
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const viewData = {
      title: 'Trainer Dashboard',
      trainer: loggedInTrainer,
    };
    logger.info(`rendering trainer dashboard for ${loggedInTrainer.firstName}`);
    loggedInTrainer.
    response.render('trainerDashboard', viewData);
  },
};

module.exports = trainerDashboard;
