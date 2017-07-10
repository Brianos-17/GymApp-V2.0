/**
 * Created by Brian on 08/07/2017.
 */
'use strict';

const logger = require('../utils/logger');

const about = {
  index(request, response) {
    logger.info('rendering app about page');
    const viewData = {
      title: 'About GymApp-V2.0',
    };
    response.render('about', viewData);
  },
};

module.exports = about;
