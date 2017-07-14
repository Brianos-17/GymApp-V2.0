/**
 * Created by Brian on 08/07/2017.
 */
'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');

const memberStore = {
  store: new JsonStore('./models/members-store.json', { members: [] }),
  collection: 'members',

  getAllMembers() {
    return this.store.findAll(this.collection);
  },

  // getMember(id) {
  //   return this.store.findOneBy(this.collection, { id: id });
  // },

  addMember(member) {
    this.store.add(this.collection, member);
    this.store.save();
  },

  getMemberById(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  getMemberByEmail(email) {
    return this.store.findOneBy(this.collection, { email: email });
  },

  addAssessment(id, assessment) {
    const member = this.getMemberById(id);
    member.assessments.unshift(assessment);//Adds to beginning of array in order to list in reverse chronological order
    this.store.save();
  },

  removeAssessment(id, assessmentId) {
    const member = this.getMemberById(id);
    _.remove(member.assessments, { assessmentId: assessmentId });
    this.store.save();
  },
};

module.exports = memberStore;
