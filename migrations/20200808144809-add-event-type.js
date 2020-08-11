'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    // logic for transforming into the new state
    return queryInterface.addColumn(
      'Events',
      'type',
      {
        type: Sequelize.ENUM,
        values: ['private', 'group'],
        defaultValue: 'private'
      },
    );

  },

  down: function(queryInterface, Sequelize) {
    // logic for reverting the changes
    return queryInterface.removeColumn(
      'Events',
      'type'
    );
  }
};
