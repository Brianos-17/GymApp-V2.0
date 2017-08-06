/**
 * Created by Brian on 08/07/2017.
 */
'use strict';

const logger = require('../utils/logger.js');
const accounts = require('./accounts.js');
const member = require('../models/members-store.js');
const trainer = require('../models/trainer-store.js');
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
    const memberId = loggedInMember.memberId;
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
    member.removeAssessment(loggedInMember.memberId, assessmentId);
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
    const enrolledClasses = [];
    loop1: for (let i = 0; i < classList.length; i++) { //cycle through each class
      loop2: for (let x = 0; x < classList[i].sessions.length; x++) { //cycle through each classes' sessions
        loop3: for (let y = 0; y < classList[i].sessions[x].members.length; y++) { //cycle through each sessions' members
          if (classList[i].sessions[x].members[y] === member.memberId) {
            enrolledClasses.push(classList[i]);
            break loop2;//break out of loop 2 so as to avoid re-adding the same class twice
          }
        }
      }
    }

    const viewData = {
      member: member,
      classList: classList,
      enrolledClass: enrolledClasses,
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

  classUnenrollment(request, response) {
    const classId = request.params.classId;
    const chosenClass = classes.getClassById(classId);
    const currentMember = accounts.getCurrentMember(request);
    for (let i = 0; i < chosenClass.sessions.length; i++) {
      let notEnrolledInThisSession = true;
      for (let x = 0; x < chosenClass.sessions[i].members.length; x++) {
        if (chosenClass.sessions[i].members[x] === currentMember.memberId) {
          notEnrolledInThisSession = false;
          break;
        }
      }

    }
    const viewData = {
      chosenClass: chosenClass,
      member: currentMember,
    };
    response.render('classUnenrollment', viewData);
  },

  enrollInClass(request, response) {
    const sessionId = request.params.sessionId;
    const classId = request.params.classId;
    const currentSession = classes.getSessionById(classId, sessionId);
    const currentMember = accounts.getCurrentMember(request);
    let notAlreadyEnrolled = true; //Boolean check to stop members from enrolling in a class more than once
    for (let i = 0; i < currentSession.members.length; i++) {
      if (currentSession.members[i] === currentMember.memberId) {
        notAlreadyEnrolled = false;
      }
    }

    if ((notAlreadyEnrolled) && (currentSession.currentCapacity < currentSession.maxCapacity)) {
      currentSession.currentCapacity += 1;
      logger.debug(`Enrolling ${currentMember.firstName}`);
      currentSession.members.push(currentMember.memberId);//Add member Id to session to keep track of enrollment and allow for boolean check
      classes.save();
    } else {
      logger.debug('Unable to enroll');
    }

    response.redirect('/memberClasses');
  },

  enrollAll(request, response) {
    const classId = request.params.classId;
    const currentClass = classes.getClassById(classId);
    const currentMember = accounts.getCurrentMember(request);
    for (let i = 0; i < currentClass.sessions.length; i++) { //cycles through each session
      let session = currentClass.sessions[i];
      let notAlreadyEnrolled = true; //Boolean check to stop members from enrolling in a class more than once
      for (let x = 0; x < session.members.length; x++) { //cycles through each member in the session
        if (session.members[x] === currentMember.memberId) {
          notAlreadyEnrolled = false;
          break; //breaks out of loop as soon as code determines that the current member is already enrolled
        }
      }

      if ((notAlreadyEnrolled) && (session.currentCapacity < session.maxCapacity)) {
        session.currentCapacity += 1;
        logger.debug(`Enrolling ${currentMember.firstName} in ${currentClass.className} on ${currentClass.sessions[i].date}`);
        session.members.push(currentMember.memberId);
        //Add member Id to session to keep track of enrollment and allow for boolean check
        classes.save();
      } else {
        logger.info('Unable to enroll in current session');
      }
    }

    response.redirect('/memberClasses');
  },

  booking(request, response) {
    const member = accounts.getCurrentMember(request);
    const trainerList = trainer.getAllTrainers();
    const bookingList = member.bookings;
    const viewData = {
      member: member,
      trainerList: trainerList,
      bookingList: bookingList,
    };
    response.render('bookings', viewData);
  },

  addNewBooking(request, response) {
    const loggedInMember = accounts.getCurrentMember(request);
    const memberId = loggedInMember.memberId;
    const trainerId = request.body.trainerId;
    const currentTrainer = trainer.getTrainerById(trainerId);
    const newBooking = {
      bookingId: uuid(),
      trainerId: trainerId,
      trainerFirstName: currentTrainer.firstName,
      trainerLastName: currentTrainer.lastName,
      bookingDate: request.body.bookingDate,
      bookingTime: request.body.bookingTime,
    };
    member.addBooking(memberId, newBooking);
    response.redirect('/memberBookings');
  },

  removeBooking(request, response) {
    const currentMember = accounts.getCurrentMember(request);
    const bookingId = request.params.bookingId;
    logger.info(`Removing booking ${bookingId} from ${currentMember.firstName}`);
    member.removeBooking(currentMember.memberId, bookingId);
    response.redirect('/memberBookings');
  },

  updateBooking(request, response) {
    const currentMember = accounts.getCurrentMember(request);
    const bookingId = request.params.bookingId;
    const updatedBooking = member.getBookingById(currentMember.memberId, bookingId);
    const trainerList = trainer.getAllTrainers();
    const viewData = {
      updatedBooking: updatedBooking,
      trainerList: trainerList,
    };
    logger.info(`Retrieving information for update to booking: ${bookingId}`);
    response.render('updateBooking', viewData);
  },

  editBooking(request, response) {
    const currentMember = accounts.getCurrentMember(request);
    const bookingId = request.params.bookingId;
    const editedBooking = member.getBookingById(currentMember.memberId, bookingId);
    const trainerId = request.body.trainerId;
    const newTrainer = trainer.getTrainerById(trainerId);
    editedBooking.trainerId = trainerId;
    editedBooking.trainerFirstName = newTrainer.firstName;
    editedBooking.trainerLastName = newTrainer.lastName;
    editedBooking.bookingDate = request.body.bookingDate;
    editedBooking.bookingTime = request.body.bookingTime;
    logger.info(`Editing booking ${bookingId} for ${currentMember.firstName}`);
    member.save();//Saves info after update
    response.redirect('/memberBookings');
  },
};

module.exports = dashboard;
