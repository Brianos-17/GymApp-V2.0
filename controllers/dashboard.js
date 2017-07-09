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
      member: loggedInMember,
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
      date: new Date(),
      weight: request.body.weight,
      chest: request.body.chest,
      thigh: request.body.thigh,
      upperArm: request.body.upperArm,
      waist: request.body.waist,
      hips: request.body.hips,
      comment: '',
    };
    logger.debug(`Adding new assessment for ${loggedInMember.firstName}`, newAssessment);
    assessments.addAssessment(newAssessment);
    response.redirect('/dashboard');
  },
};

module.exports = dashboard;
