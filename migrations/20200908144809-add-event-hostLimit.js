'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    // logic for transforming into the new state
    return queryInterface.addColumn(
      'Events',
      'hostLimit',
      {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
    );

  },

  down: function(queryInterface, Sequelize) {
    // logic for reverting the changes
    return queryInterface.removeColumn(
      'Events',
      'hostLimit'
    );
  }
};
