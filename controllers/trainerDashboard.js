/**
 * Created by Brian on 15/07/2017.
 */
'use strict';

const logger = require('../utils/logger.js');
const accounts = require('./accounts.js');
const members = require('../models/members-store.json');
const trainer = require('../models/trainer-store.js');

const trainerDashboard = {
  index(request, response) {
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const viewData = {
      title: 'Trainer Dashboard',
      trainer: loggedInTrainer,
      members: [],
    };
    logger.info(`rendering trainer dashboard for ${loggedInTrainer.firstName}`);
    response.render('trainerDashboard', viewData);
  },

  addMemberList(request) {
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const id = loggedInTrainer.id;
    const members = members;
    trainer.addMemberList(id, members);
  },
};

module.exports = trainerDashboard;
