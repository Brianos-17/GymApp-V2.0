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
    const memberId = request.params.memberId; //Retrieves members id from the #each loop in member-list.hbs
    const viewedMember = member.getMemberById(memberId);
    const bmi = analytics.calculateBMI(viewedMember);
    const idealBodyWeight = analytics.idealBodyWeight(viewedMember);
    const viewData = {
      member: viewedMember,
      bmi: bmi,
      bmiCategory: analytics.BMICategory(bmi),
      idealBodyWeight: idealBodyWeight,
      memberId: memberId,
    };
    logger.debug(`Rendering assessments for ${viewedMember.firstName}`);
    const list = viewedMember.assessments; //toggles boolean to allow trainers view update comment section
    for (let i = 0; i < list.length; i++) {
      list[i].updateComment = true;
    }

    response.render('assessments', viewData);
  },

  removeMember(request, response) {
    const memberId = request.params.memberId; //Retrieves members id from the #each loop in member-list.hbs
    logger.debug(`Deleting member ${memberId}`);
    member.removeMember(id);
    response.redirect('/trainerDashboard');
  },

  removeAssessment(request, response) {
    const memberId = request.params.memberId;
    const assessmentId = request.params.assessmentId;
    member.removeAssessment(memberId, assessmentId);
    logger.debug(`Removing Assessment ${assessmentId} for member ${memberId}`);
    response.redirect('/trainerDashboard');
  },

  updateComment(request, response) {
    const memberId = request.params.memberId;
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
        members: [],//Array of members in order to keep track of who has enrolled in each session
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

  booking(request, response) {
    const trainer = accounts.getCurrentTrainer(request);
    const memberList = member.getAllMembers();
    const bookingList = trainer.bookings;
    const viewData = {
      trainer: trainer,
      memberList: memberList,
      bookingList: bookingList,
    };
    response.render('bookings', viewData);
  },

  addNewBooking(request, response) {
    const loggedInTrainer = accounts.getCurrentTrainer(request);
    const trainerId = loggedInTrainer.trainerId;
    const memberId = request.body.memberId;
    const currentMember = member.getMemberById(memberId);
    const newBooking = {
      bookingId: uuid(),
      memberId: memberId,
      trainerFirstName: loggedInTrainer.firstName,
      trainerLastName: loggedInTrainer.lastName,
      memberFirstName: currentMember.firstName,
      memberLastName: currentMember.lastName,
      bookingDate: request.body.bookingDate,
      bookingTime: request.body.bookingTime,
    };
    trainer.addBooking(trainerId, newBooking);
    member.addBooking(memberId, newBooking);
    response.redirect('/trainerBookings');
  },

  removeBooking(request, response) {
    const currentTrainer = accounts.getCurrentTrainer(request);
    const bookingId = request.params.bookingId;
    logger.info(`Removing booking ${bookingId} from ${currentTrainer.firstName}`);
    trainer.removeBooking(currentTrainer.trainerId, bookingId);
    response.redirect('/trainerBookings');
  },

  updateBooking(request, response) {
    const currentTrainer = accounts.getCurrentTrainer(request);
    const bookingId = request.params.bookingId;
    const updatedBooking = trainer.getBookingById(currentTrainer.trainerId, bookingId);
    const memberList = member.getAllMembers();
    const viewData = {
      updatedBooking: updatedBooking,
      memberList: memberList,
    };
    logger.info(`Retrieving information for update to booking: ${bookingId}`);
    response.render('updateBooking', viewData);
  },

  editBooking(request, response) {
    const currentTrainer = accounts.getCurrentTrainer(request);
    const bookingId = request.params.bookingId;
    const editedBooking = trainer.getBookingById(currentTrainer.trainerId, bookingId);
    const memberId = request.body.memberId;
    const newMember = member.getMemberById(memberId);
    editedBooking.memberId = memberId;
    editedBooking.memberFirstName = newMember.firstName;
    editedBooking.memberLastName = newMember.lastName;
    editedBooking.bookingDate = request.body.bookingDate;
    editedBooking.bookingTime = request.body.bookingTime;
    logger.info(`Editing booking ${bookingId} for ${currentTrainer.firstName}`);
    trainer.save();//Saves info after update
    response.redirect('/trainerBookings');
  },

  goals(request, response) {
    const currentTrainer = accounts.getCurrentTrainer(request);
    const memberList = member.getAllMembers();
    const viewData = {
      trainer: currentTrainer,
      memberList: memberList,
    };
    response.render('goals', viewData);
  },

  addNewGoal(request, response) {
    const memberId = request.body.memberId;
    logger.info(memberId);
    const newGoal = {
      goalId: uuid(),
      targetArea: request.body.targetArea,
      targetGoal: request.body.targetGoal,
      goalDate: request.body.goalDate,
      description: request.body.description,
      status: 'open',
    };
    member.addGoal(memberId, newGoal);
    response.redirect('/trainerGoals');
  },

  fitnessProgram(request, response) {
    const currentTrainer = accounts.getCurrentTrainer(request);
    const classList = classes.getAllClasses();
    const memberList = member.getAllMembers();
    const viewData = {
      trainer: currentTrainer,
      classList: classList,
      memberList: memberList,
    };
    response.render('fitnessProgram', viewData);
  },

  addNewProgram(request, response) {
    const memberId = request.body.memberId;
    const newProgram = {
      programId: uuid(),
      session1: request.body.session1,
      session2: request.body.session2,
      session3: request.body.session3,
      session4: request.body.session4,
      session5: request.body.session5,
    };
    member.addProgram(memberId, newProgram);
    logger.info(`Assigning member ${memberId} new fitness program ${newProgram.programId}`);
    response.redirect('/trainerFitnessProgram');
  },
};

module.exports = trainerDashboard;
