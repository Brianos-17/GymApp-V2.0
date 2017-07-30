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
    logger.info('Rendering classes');
    response.render('classes', viewData);
  },

  addNewClass(request, response) {
    const newClass = {
      classId: uuid(),
      className: request.body.className,
      difficultyLevel: request.body.difficultyLevel,
      classTime: request.body.classTime,
      sessions: [],
    };

    for (let i = 0; i < parseInt(request.body.duration, 10); i++) {
      const startDate = new Date(request.body.startDate);
      const date = new Date(startDate.setTime((startDate.getTime() + 86400000)  + ((7 * i) * 86400000)));
      //Retrieved from: https://stackoverflow.com/questions/6963311/add-days-to-a-date-object
      //Date being set backwards as it is not initialized in GMT. Adding extra day to offset this
      const session = {
        sessionId: uuid(),
        date: date.toISOString().substring(0, 10),//substring to only get date and remove timestamp
        currentCapacity: 0,
        maxCapacity: parseInt(request.body.maxCapacity, 10),//Converts string to int
      };
      newClass.sessions.push(session);
    }

    classes.addClasses(newClass);
    response.redirect('/classes');
  },

  removeClass(request, response) {
    const classId = request.params.classId;
    logger.debug(`Deleting class ${classId}`);
    classes.removeClass(classId);
    response.redirect('/classes');
  },

  updateClass(request, response) {
    const classId = request.params.classId;
    const updatedClass = classes.getClassById(classId);
    const viewData = {
      updatedClass: updatedClass,
    };
    response.render('updateClass', viewData);
  },

  editClass(request, response) {
    const classId = request.params.classId;
    const editedClass = classes.getClassById(classId);
    editedClass.className = request.body.className;
    editedClass.duration = request.body.duration;
    const maxCapacity = parseInt(request.body.maxCapacity, 10);//converts string to int
    editedClass.maxCapacity = maxCapacity;
    editedClass.difficultyLevel = request.body.difficultyLevel;
    editedClass.classTime = request.body.classTime;
    editedClass.startDate = request.body.startDate;
    classes.save();
    response.redirect('/classes');
  },
};

module.exports = trainerDashboard;
