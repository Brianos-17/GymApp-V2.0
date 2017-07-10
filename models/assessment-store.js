/**
 * Created by Brian on 08/07/2017.
 */
'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');

const assessment = {
  store: new JsonStore('./models/members-store.json', { assessments: [] }),
  collection: 'assessments',

  getAllAssessments() {
    return this.store.findAll(this.collection);
  },

  getAssessment(assessmentId) {
    return this.store.findOneBy(this.collection, { assessmentId: assessmentId });
  },

  removeAssessment(assessmentId) {
    const assessment = this.getAssessment(assessmentId);
    this.store.remove(this.collection, assessment);
    this.store.save();
  },

  removeAllAssessments() {
    this.store.removeAll(this.collection);
    this.store.save();
  },
};

module.exports = assessment;
