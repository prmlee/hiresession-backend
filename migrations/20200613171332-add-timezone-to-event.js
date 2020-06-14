'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    // logic for transforming into the new state
    return queryInterface.addColumn(
      'Events',
      'timezoneOffset',
      {
        type: Sequelize.INTEGER,
        defaultValue: 300, // EST TIME
      }
    );

  },

  down: function(queryInterface, Sequelize) {
    // logic for reverting the changes
    return queryInterface.removeColumn(
      'Events',
      'timezoneOffset'
    );
  }
};
