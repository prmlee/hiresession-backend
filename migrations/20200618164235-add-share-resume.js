'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    // logic for transforming into the new state
    return queryInterface.addColumn(
      'Interviews',
      'shareResume',
      {
        type: Sequelize.STRING,
        defaultValue: '',
      }
    );

  },

  down: function(queryInterface, Sequelize) {
    // logic for reverting the changes
    return queryInterface.removeColumn(
      'Interviews',
      'shareResume'
    );
  }
};
