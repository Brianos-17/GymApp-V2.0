/**
 * Created by Brian on 13/07/2017.
 */

const accounts = require('../controllers/accounts');
const member = require('../models/members-store');

const analytics = {
  calculateBMI(member) {
    const list = member.assessments;
    if (list > 0) {
      const latestAssessment = list[0];//Check first assessment as all new ones are being added to start, not end
      return (latestAssessment.weight / (member.height * member.height)).toFixed(2);//rounds number to 2 decimal places
    } else {
      return (member.startingWeight / (member.height * member.height)).toFixed(2);
    }
  },

  BMICategory(bmi) {
    if (bmi < 15) {
      return 'VERY SEVERELY UNDERWEIGHT';
    } else if ((bmi >= 15) && (bmi < 16)) {
      return 'SEVERELY UNDERWEIGHT';
    } else if ((bmi >= 16) && (bmi < 18.5)) {
      return 'UNDERWEIGHT';
    } else if ((bmi >= 18.5) && (bmi < 25)) {
      return 'NORMAL';
    } else if ((bmi >= 25) && (bmi < 30)) {
      return 'OVERWEIGHT';
    } else if ((bmi >= 30) && (bmi < 35)) {
      return 'MODERATELY OBESE';
    } else if ((bmi >= 35) && (bmi < 40)) {
      return 'SEVERELY OBESE';
    } else {
      return 'VERY SEVERELY OBESE';
    }
  },

  idealBodyWeight(member) {
    const inches = (member.height * 39.37);
    const list = member.assessments;
    let idealWeight = 0;
    if (inches > 60) {
      const over60 = ((inches - 60) * 2.3);
      if (member.gender.equals('M')) {
        idealWeight = (over60 + 50);
      } else {
        idealWeight = (over60 + 45);
      }
    } else {
      if (member.gender.equals('M')) {
        idealWeight = 50;
      } else {
        idealWeight = 45;
      }
    }

    if (list > 0) {
      const latestAssessment = list[0];
      if ((latestAssessment.weight <= (idealWeight + 2)) && (latestAssessment.weight >= (idealWeight - 2))) {
        return 'green';
      } else { return 'red';
      }
    } else {
      if ((member.startingWeight <= (idealWeight + 2)) && (member.startingWeight >= (idealWeight - 2))) {
        return 'green';
      } else { return 'red';
      }
    }
  },
};

module.exports = analytics;
