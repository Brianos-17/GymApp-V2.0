/**
 * Created by Brian on 15/07/2017.
 */
'use strict';

const logger = require('../utils/logger.js');
const accounts = require('./accounts.js');
const member = require('../models/members-store.js');
const trainer = require('../models/trainer-store.js');

const trainerDashboard = {
  index(request, response) {
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const memberList = member.getAllMembers();
    const viewData = {
      title: 'Trainer Dashboard',
      trainer: loggedInTrainer,
      memberList: memberList,
    };
    logger.info(`rendering trainer dashboard for ${loggedInTrainer.firstName}`);
    response.render('trainerDashboard', viewData);
  },

  viewMemberAssessments(request, response) {
    const id = request.params.id;
  },

  removeMember(request, response) {
    const id = request.params.id;
    logger.debug(`Deleting member ${id}`);
    member.removeMember(id);
    response.redirect('/trainerDashboard');
  },
};

module.exports = trainerDashboard;
