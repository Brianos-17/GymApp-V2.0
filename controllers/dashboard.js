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

  removeAssessment(request, response) {
    const assessmentId = request.params.assessmentId;
    const loggedInMember = accounts.getCurrentMember(request);
    member.removeAssessment(loggedInMember.id, assessmentId);
    logger.debug(`Deleting Assessment ${assessmentId} for ${loggedInMember.firstName}`);
    response.redirect('/dashboard');

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

  enrollInClass(request, response) {
    const classId = request.params.classId;
    const enrolledClass = classes.getClassById(classId);
    const currentMember = accounts.getCurrentMember(request);
    if (enrolledClass.currentCapacity < enrolledClass.maxCapacity) {
      enrolledClass.currentCapacity += 1;
      logger.debug(`Enrolling ${currentMember.firstName} in ${enrolledClass.className} class`);
    } else {
      alert('This class is already full');
    }

    response.redirect('/memberClasses');
  },
};

module.exports = dashboard;
