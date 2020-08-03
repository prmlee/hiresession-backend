'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    // logic for transforming into the new state
    return queryInterface.removeColumn(
      'Interviews',
      'shareResume'
    );
  },

  down: function(queryInterface, Sequelize) {
    // logic for reverting the changes
    
    return queryInterface.addColumn(
      'Interviews',
      'shareResume',
      {
        type: Sequelize.STRING,
        defaultValue: ''
      },
    );
  }
};
