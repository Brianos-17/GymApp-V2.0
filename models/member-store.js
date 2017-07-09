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

  addMember(member) {
    this.store.add(this.collection, member);
  },

  getMemberById(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  getMemberByEmail(email) {
    return this.store.findOneBy(this.collection, { email: email});
  },
};

module.exports = memberStore;
