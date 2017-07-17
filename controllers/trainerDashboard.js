/**
 * Created by Brian on 15/07/2017.
 */
'use strict';

const logger = require('../utils/logger.js');
const accounts = require('./accounts.js');
const allMembers = require('../models/members-store.js');
const trainer = require('../models/trainer-store.js');

const trainerDashboard = {
  index(request, response) {
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const memberList = allMembers.getAllMembers();
    const viewData = {
      title: 'Trainer Dashboard',
      trainer: loggedInTrainer,
      memberList: memberList,
    };
    logger.info(`rendering trainer dashboard for ${loggedInTrainer.firstName}`);
    response.render('trainerDashboard', viewData);
  },

  removeMember(request, response) {
    const id = request.params.id;
    const removedMember = allMembers.getMemberById(id);
    logger.debug(`Deleting member ${id}`);
    
  }
};

module.exports = trainerDashboard;
