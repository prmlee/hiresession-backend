'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    // logic for transforming into the new state
    return queryInterface.addColumn(
      'EventTicketTypes',
      'details',
      {
        type: Sequelize.TEXT,
      },
    );

  },

  down: function(queryInterface, Sequelize) {
    // logic for reverting the changes
    return queryInterface.removeColumn(
      'EventTicketTypes',
      'details'
    );
  }
};
