/**
 * Created by Brian on 08/07/2017.
 */
'use strict';

const logger = require('../utils/logger.js');
const accounts = require('./accounts.js');
const member = require('../models/members-store.js');
const uuid = require('uuid');
const analytics = require('../utils/analytics');
const classes = require('../models/class-store.js');

const dashboard = {
  index(request, response) {
    logger.info('rendering dashboard');
    const loggedInMember = accounts.getCurrentMember(request);
    const bmi = analytics.calculateBMI(loggedInMember);
    const idealBodyWeight = analytics.idealBodyWeight(loggedInMember);
    const viewData = {
      title: 'Member Dashboard',
      member: loggedInMember,
      bmi: bmi,
      bmiCategory: analytics.BMICategory(bmi),
      idealBodyWeight: idealBodyWeight,
    };
    logger.info(`rendering assessments for ${loggedInMember.firstName}`);
    const list = loggedInMember.assessments; //toggles boolean to disallow members view update comment section
    for (let i = 0; i < list.length; i++) {
      list[i].updateComment = false;
    }

    response.render('dashboard', viewData);
  },

  addAssessment(request, response) {
    const loggedInMember = accounts.getCurrentMember(request);
    const memberId = loggedInMember.id;
    const newAssessment = {
      assessmentId: uuid(),
      date: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''), //Retrieved from https://stackoverflow.com/questions/10645994/node-js-how-to-format-a-date-string-in-utc
      //Returns date in simple ISO format, replaces unnecessary characters with spaces to make format readable
      weight: request.body.weight,
      chest: request.body.chest,
      thigh: request.body.thigh,
      upperArm: request.body.upperArm,
      waist: request.body.waist,
      hips: request.body.hips,
      trend: '',
      comment: '',
      updateComment: false,//boolean to toggle update comment section on and off for members and trainers
    };
    logger.debug(`Adding new assessment for ${loggedInMember.firstName}`, newAssessment);
    member.addAssessment(memberId, newAssessment);
    analytics.trend(loggedInMember);
    response.redirect('/dashboard');
  },

  removeAssessment(request, response) {
    const assessmentId = request.params.assessmentId;
    const loggedInMember = accounts.getCurrentMember(request);
    member.removeAssessment(loggedInMember.id, assessmentId);
    logger.debug(`Deleting Assessment ${assessmentId} for ${loggedInMember.firstName}`);
    response.redirect('/dashboard');

  },

  account(request, response) {
    const loggedInMember = accounts.getCurrentMember(request);
    const viewData = {
      member: loggedInMember,
    };
    response.render('account', viewData);
  },

  updateProfile(request, response) {
    const loggedInMember = accounts.getCurrentMember(request);
    if (request.body.firstName) {
      loggedInMember.firstName = request.body.firstName;
    } else if (request.body.lastName) {
      loggedInMember.lastName = request.body.lastName;
    } else if (request.body.email) {
      loggedInMember.email = request.body.email;
    } else if (request.body.gender) {
      loggedInMember.gender = request.body.gender;
    } else if (request.body.password) {
      loggedInMember.password = request.body.password;
    } else if (request.body.height) {
      loggedInMember.height = request.body.height;
    } else if (request.body.startingWeight) {
      loggedInMember.startingWeight = request.body.startingWeight;
    }

    member.save();//save info to JSON file after made
    response.redirect('/account');
  },

  showClasses(request, response) {
    const member = accounts.getCurrentMember(request);
    const classList = classes.getAllClasses();
    const viewData = {
      member: member,
      classList: classList,
    };
    logger.info('Rendering classes');
    response.render('classes', viewData);
  },

  classEnrollment(request, response) {
    const classId = request.params.classId;
    const chosenClass = classes.getClassById(classId);
    const currentMember = accounts.getCurrentMember(request);
    const viewData = {
      chosenClass: chosenClass,
      member: currentMember,
    };
    response.render('classEnrollment', viewData);
  },

  enrollInClass(request, response) {
    const sessionId = request.params.sessionId;
    const classId = request.params.classId;
    const currentSession = classes.getSessionById(classId, sessionId);
    const currentMember = accounts.getCurrentMember(request);
    let notAlreadyEnrolled = true; //Boolean check to stop members from enrolling in a class more than once
    for (let i = 0; i < currentMember.sessions.length; i++) {
      if (currentMember.sessions[i].sessionId === sessionId) {
        notAlreadyEnrolled = false;
      }
    }
    if ((notAlreadyEnrolled) && (currentSession.currentCapacity < currentSession.maxCapacity)) {
      currentSession.currentCapacity += 1;
      logger.debug(`Enrolling ${currentMember.firstName}`);
      currentMember.sessions.push(currentSession);
      member.save();
      classes.save();
    } else {
      logger.debug('Unable to enroll ');
    }

    response.redirect('/memberClasses');
  },

  enrollAll(request, response) {
    const classId = request.params.classId;
    const currentClass = classes.getClassById(classId);
    // const currentMember = accounts.getCurrentMember(request);
    // for (let i = 0; i < currentClass.sessions.length; i++) {
    //   const sessionId = currentClass.sessions[i].sessionId;
    //   for (let x = 0; x < currentMember.sessions.length; x++) {
    //     const enrolledSessionId = currentMember.sessions[x].sessionId;
    //     if (sessionId === enrolledSessionId) {
    //       break;
    //     } else {
    //
    //     }
      }
    }

    response.redirect('/memberClasses');
  },
};

module.exports = dashboard;
