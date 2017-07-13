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
    if (bmi < 15) {
      return "VERY SEVERELY UNDERWEIGHT";
    } else if ((bmi >= 15) && (bmi < 16)) {
      return "SEVERELY UNDERWEIGHT";
    } else if ((bmi >= 16) && (bmi < 18.5)) {
      return "UNDERWEIGHT";
    } else if ((bmi >= 18.5) && (bmi < 25)) {
      return "NORMAL";
    } else if ((bmi >= 25) && (bmi < 30)) {
      return "OVERWEIGHT";
    } else if ((bmi >= 30) && (bmi < 35)) {
      return "MODERATELY OBESE";
    } else if ((bmi >= 35) && (bmi < 40)) {
      return "SEVERELY OBESE";
    } else {
      return "VERY SEVERELY OBESE";
    }
  },
};

module.exports = analytics;
