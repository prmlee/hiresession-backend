'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    // logic for transforming into the new state
    return queryInterface.addColumn(
      'EventTickets',
      'promoPercent',
      {
        type: Sequelize.INTEGER,
      },
    );

  },

  down: function(queryInterface, Sequelize) {
    // logic for reverting the changes
    return queryInterface.removeColumn(
      'EventTickets',
      'promoPercent'
    );
  }
};
