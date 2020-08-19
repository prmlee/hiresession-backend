'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    // logic for transforming into the new state
    return queryInterface.addColumn(
      'employeeSettings',
      'startUrl',
      {
        type: Sequelize.TEXT,
        defaultValue:''
      },
    );

  },

  down: function(queryInterface, Sequelize) {
    // logic for reverting the changes
    return queryInterface.removeColumn(
      'employeeSettings',
      'startUrl'
    );
  }
};
