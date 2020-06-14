'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    // logic for transforming into the new state
    return queryInterface.addColumn(
      'employeeSettings',
      'timezoneName',
      {
        type: Sequelize.STRING,
        defaultValue: 'EST', // EST TIME
      }
    );

  },

  down: function(queryInterface, Sequelize) {
    // logic for reverting the changes
    return queryInterface.removeColumn(
      'employeeSettings',
      'timezoneName'
    );
  }
};
