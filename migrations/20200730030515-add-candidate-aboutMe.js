'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    // logic for transforming into the new state
    return queryInterface.addColumn(
      'Candidates',
      'aboutMe',
      {
        type: Sequelize.STRING(1024),
        allowNull:true
      },
    );

  },

  down: function(queryInterface, Sequelize) {
    // logic for reverting the changes
    return queryInterface.removeColumn(
      'Candidates',
      'aboutMe'
    );
  }
};
