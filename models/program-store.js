'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');

const programStore = {
  store: new JsonStore('./models/program-store.json', { programs: [] }),
  collection: 'programs',

  getAllPrograms() {
    return this.store.findAll(this.collection);
  },

  getProgramById(programId) {
    return this.store.findOneBy(this.collection, { programId: programId });
  },

  addProgram(newProgram) {
    this.store.add(this.collection, newProgram);
    this.store.save();
  },

  removeProgram(programId) {
    const removedProgram = this.getProgramById(programId);
    this.store.remove(this.collection, removedProgram);
    this.store.save();
  },

  save() {
    this.store.save();
  },
};

module.exports = programStore;