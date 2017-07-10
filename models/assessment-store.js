/**
 * Created by Brian on 08/07/2017.
 */
'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');

const assessment = {
  store: new JsonStore('./models/members-store.json', { members: [] }),
  collection: 'members',

  getAllAssessments() {
    return this.store.findAll(this.collection);
  },

  getAssessment(assessmentId) {
    return this.store.findOneBy(this.collection, { assessmentId: assessmentId });
  },

  // getMemberAssessments(memberId) {
  //   return this.store.findBy(this.collection, { memberId: memberId });
  // },

  addAssessment(assessment) {
    this.store.add(this.collection, assessment);
    this.store.save();
  },

  removeAssessment(id) {
    const assessment = this.getAssessment(id);
    this.store.remove(this.collection, assessment);
    this.store.save();
  },

  removeAllAssessments() {
    this.store.removeAll(this.collection);
    this.store.save();
  },
};

module.exports = assessment;
