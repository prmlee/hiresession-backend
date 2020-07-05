'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    // logic for transforming into the new state
    return queryInterface.addColumn(
      'Candidates',
      'state',
      {
        type: Sequelize.STRING,
        allowNull:true
      },
    );

  },

  down: function(queryInterface, Sequelize) {
    // logic for reverting the changes
    return queryInterface.removeColumn(
      'Candidates',
      'state'
    );
  }
};
