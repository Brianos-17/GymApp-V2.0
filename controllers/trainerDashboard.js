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
    const id = request.params.id; //Retrieves members id from the #each loop in member-list.hbs
    const viewedMember = member.getMemberById(id);
    //const loggedInTrainer = accounts.getCurrentTrainer(request);
    logger.debug(`Rendering assessments for ${viewedMember.firstName}`);
    response.redirect('/dashboard', viewedMember);
  },

  removeMember(request, response) {
    const id = request.params.id; //Retrieves members id from the #each loop in member-list.hbs
    logger.debug(`Deleting member ${id}`);
    member.removeMember(id);
    response.redirect('/trainerDashboard');
  },
};

module.exports = trainerDashboard;
