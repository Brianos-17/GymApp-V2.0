/**
 * Created by Brian on 15/07/2017.
 */
'use strict';

const logger = require('../utils/logger.js');
const accounts = require('./accounts.js');

const trainerDashboard = {
  index(request, response) {
    logger.info('rendering trainer dashboard');
    const loggedInTrainer = accounts.getCurrentTrainer(request);
  }
}