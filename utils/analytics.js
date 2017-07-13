/**
 * Created by Brian on 13/07/2017.
 */

const accounts = require('../controllers/accounts');
const member = require('../models/members-store');

const analytics = {
  calculateBMI(member) {
    const list = member.assessments;
    const latestAssessment = list[0];//Check first assessment as all new ones are being added to start, not end
    if (list.length > 0) {
      return (latestAssessment.weight / (member.height * member.height));
    } else {
      return (member.startingWeight / (member.height * member.height));
    }
  },

  BMICategory(bmi) {

  },
};

module.exports = analytics;
