/**
 * Created by Brian on 08/07/2017.
 */
'use strict';

const memberStore = require('../models/members-store');
const trainerStore = require('../models/trainer-store');
const logger = require('../utils/logger');
const uuid = require('uuid');

const accounts = {

  index(request, response) {
    const viewData = {
      title: 'Login or Signup',
    };
    response.render('index', viewData);
  },

  login(request, response) {
    const viewData = {
      title: 'Login to the Gym',
    };
    response.render('login', viewData);
  },

  logout(request, response) {
    response.cookie('member', '');
    logger.info('Logging out...');
    response.redirect('/');
  },

  signup(request, response) {
    const viewData = {
      title: 'Sign up to join the Gym',
    };
    response.render('signup', viewData);
  },

  register(request, response) {
    const member = request.body;
    member.id = uuid();
    member.assessments = [];
    memberStore.addMember(member);
    logger.info(`registering ${member.email}`);
    response.redirect('/');
  },

  authenticate(request, response) {
    const member = memberStore.getMemberByEmail(request.body.email);
    const trainer = trainerStore.getTrainerByEmail(request.body.email);
    if (member) {
      response.cookie('member', member.email);
      logger.info(`${member.email} successfully authenticated. Logging in...`);
      response.redirect('/dashboard');
    } else if (trainer) {
      response.cookie('trainer', trainer.email);
      logger.info(`${trainer.email} successfully authenticated. Logging in...`);
      response.redirect('/trainerDashboard');
    } else {
      logger.info('authentication failed');
      response.redirect('/login');
    }
  },

  getCurrentMember(request) {
    const memberEmail = request.cookies.member;
    return memberStore.getMemberByEmail(memberEmail);
  },

  getCurrentTrainer(request) {
    const trainerEmail = request.cookies.trainer;
    return trainerStore.getTrainerByEmail(trainerEmail);
  },
};

module.exports = accounts;
