/**
 * Created by Brian on 08/07/2017.
 */
'use strict';

const logger = require('../utils/logger.js');
const accounts = require('./accounts.js');
const assessments = require('../models/assessment-store.js');
const uuid = require('uuid');

const dashboard = {
  index(request, response) {
    logger.info('rendering dashboard');
    const loggedInMember = accounts.getCurrentMember(request);
    const viewData = {
      title: 'Member Dashboard',
      assessments: assessments.getMemberAssessments(loggedInMember.id),
    };
    logger.info(`rendering assessments for ${loggedInMember.firstName}`, assessments.getAllAssessments());
    response.render('dashboard', viewData);
  },

  deleteAssessment(request, response) {
    const assessmentId = request.params.id;
    logger.debug(`Deleting Assessment ${assessmentId}`);
    assessments.removeAssessment(assessmentId);
    response.redirect('/dashboard');
  },

  addAssessment(request, response) {
    const loggedInMember = accounts.getCurrentMember(request);
    const newAssessment = {
      id: uuid(),

    }
  }

}
