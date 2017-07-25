'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');

const classStore = {
  store: new JsonStore('./models/class-store.json', { classes: [] }),
  collection: 'classes',

  getAllClasses() {
    return this.store.findAll(this.collection);
  },

  getClassById(classId) {
    return this.store.findOneBy(this.collection, { classId: classId });
  },

  addClasses(newClass) {
    this.store.add(this.collection, newClass);
    this.store.save();
  },

  removeClass(classId) {
    const removedClass = this.getClassById(classId);
    this.store.remove(this.collection, removedClass);
    this.store.save();
  },
};

module.exports = classStore;
