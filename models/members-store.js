/**
 * Created by Brian on 08/07/2017.
 */
'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');
const analytics = require('../utils/analytics');

const memberStore = {
  store: new JsonStore('./models/members-store.json', { members: [] }),
  collection: 'members',

  getAllMembers() {
    return this.store.findAll(this.collection);
  },

  addMember(member) {
    this.store.add(this.collection, member);
    this.store.save();
  },

  getMemberById(memberId) {
    return this.store.findOneBy(this.collection, { memberId: memberId });
  },

  getMemberByEmail(email) {
    return this.store.findOneBy(this.collection, { email: email });
  },

  removeMember(memberId) {
    const removedMember = this.getMemberById(memberId);
    this.store.remove(this.collection, removedMember);
    this.store.save();
  },

  getAssessmentById(memberId, assessmentId) {
    const member = this.getMemberById(memberId);
    for (let i = 0; i < member.assessments.length; i++) {
      if (member.assessments[i].assessmentId === assessmentId) {
        return member.assessments[i];
      }
    }
  },

  addAssessment(memberId, assessment) {
    const member = this.getMemberById(memberId);
    member.assessments.unshift(assessment);//Adds to beginning of array in order to list in reverse chronological order
    this.store.save();
  },

  removeAssessment(memberId, assessmentId) {
    const member = this.getMemberById(memberId);
    _.remove(member.assessments, { assessmentId: assessmentId });
    this.store.save();
  },

  addBooking(memberId, booking) {
    const member = this.getMemberById(memberId);
    member.bookings.push(booking);
    this.store.save();
  },

  getBookingById(memberId, bookingId) {
    const member = this.getMemberById(memberId);
    for (let i = 0; i < member.bookings.length; i++) {
      if (member.bookings[i].bookingId === bookingId) {
        return member.bookings[i];
      }
    }
  },

  getAllBookings(memberId) {
    const member = this.getMemberById(memberId);
    return member.bookings;
  },

  removeBooking(memberId, bookingId) {
    const member = this.getMemberById(memberId);
    _.remove(member.bookings, { bookingId: bookingId });
    this.store.save();
  },

  addGoal(memberId, goal) {
    const member = this.getMemberById(memberId);
    member.goals.push(goal);
    this.store.save();
  },

  removeGoal(memberId, goalId) {
    const member = this.getMemberById(memberId);
    _.remove(member.goals, { goalId: goalId });
    this.store.save();
  },

  save() {
    this.store.save(); //Method used by controllers which saves the JSON object after they have altered data
  },
};

module.exports = memberStore;
