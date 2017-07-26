/**
 * Created by Brian on 15/07/2017.
 */
'use strict';

const logger = require('../utils/logger.js');
const accounts = require('./accounts.js');
const analytics = require('../utils/analytics.js');
const member = require('../models/members-store.js');
const trainer = require('../models/trainer-store.js');
const classes = require('../models/class-store.js');
const uuid = require('uuid');

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
    const bmi = analytics.calculateBMI(viewedMember);
    const idealBodyWeight = analytics.idealBodyWeight(viewedMember);
    const viewData = {
      member: viewedMember,
      bmi: bmi,
      bmiCategory: analytics.BMICategory(bmi),
      idealBodyWeight: idealBodyWeight,
      id: id,
    };
    logger.debug(`Rendering assessments for ${viewedMember.firstName}`);
    const list = viewedMember.assessments; //toggles boolean to allow trainers view update comment section
    for (let i = 0; i < list.length; i++) {
      list[i].updateComment = true;
    }

    response.render('assessments', viewData);
  },

  removeMember(request, response) {
    const id = request.params.id; //Retrieves members id from the #each loop in member-list.hbs
    logger.debug(`Deleting member ${id}`);
    member.removeMember(id);
    response.redirect('/trainerDashboard');
  },

  removeAssessment(request, response) {
    const memberId = request.params.id;
    const assessmentId = request.params.assessmentId;
    member.removeAssessment(memberId, assessmentId);
    logger.debug(`Removing Assessment ${assessmentId} for member ${memberId}`);
    response.redirect('/trainerDashboard');
  },

  updateComment(request, response) {
    const memberId = request.params.id;
    const assessmentId = request.params.assessmentId;
    const comment = request.body.comment;
    const assessmentToUpdate = member.getAssessmentById(memberId, assessmentId);
    assessmentToUpdate.comment = comment;
    member.save();
    response.redirect('/trainerDashboard');
  },

  showClasses(request, response) {
    const trainer = accounts.getCurrentTrainer(request);
    const classList = classes.getAllClasses();
    const viewData = {
      trainer: trainer, //toggles the addNewClass form in classes.hbs on and off
      classList: classList,
    };
    response.render('classes', viewData);
  },

  addNewClass(request, response) {
    const newClass = {
      classId: uuid(),
      className: request.body.className,
      duration: request.body.duration,
      maxCapacity: request.body.maxCapacity,
      currentCapacity: "0",
      difficultyLevel: request.body.difficultyLevel,
      classTime: request.body.classTime,
      startDate: request.body.startDate,
    };
    classes.addClasses(newClass);
    response.redirect('/classes');
  },
};

module.exports = trainerDashboard;
