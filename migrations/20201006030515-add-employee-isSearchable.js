'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    // logic for transforming into the new state
    return queryInterface.addColumn(
      'Employees',
      'isSearchable',
      {
        type: Sequelize.INTEGER,
        defaultValue:0
      },
    );

  },

  down: function(queryInterface, Sequelize) {
    // logic for reverting the changes
    return queryInterface.removeColumn(
      'Employees',
      'isSearchabel'
    );
  }
};
