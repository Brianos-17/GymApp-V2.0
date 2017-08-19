'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');

const trainerStore = {

  store: new JsonStore('./models/trainer-store.json', { trainers: [] }),
  collection: 'trainers',

  getAllTrainers() {
    return this.store.findAll(this.collection);
  },

  addTrainer(trainer) {
    this.store.add(this.collection, trainer);
  },

  getTrainerById(trainerId) {
    return this.store.findOneBy(this.collection, { trainerId: trainerId });
  },

  getTrainerByEmail(email) {
    return this.store.findOneBy(this.collection, { email: email });
  },

  addMemberList(trainerId, members) {
    const trainer = this.getTrainerById(trainerId);
    trainer.members.push(members);
    this.store.save();
  },

  addBooking(trainerId, booking) {
    const trainer = this.getTrainerById(trainerId);
    trainer.bookings.push(booking);
    this.store.save();
  },

  getBookingById(trainerId, bookingId) {
    const trainer = this.getTrainerById(trainerId);
    for (let i = 0; i < trainer.bookings.length; i++) {
      if (trainer.bookings[i].bookingId === bookingId) {
        return trainer.bookings[i];
      }
    }
  },

  removeBooking(trainerId, bookingId) {
    const trainer = this.getTrainerById(trainerId);
    _.remove(trainer.bookings, { bookingId: bookingId });
    this.store.save();
  },

  save() {
    this.store.save(); //Method used by controllers which saves the JSON object after they have altered data
  },
};

module.exports = trainerStore;
