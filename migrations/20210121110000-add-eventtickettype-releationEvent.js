'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    // logic for transforming into the new state
    return queryInterface.addColumn(
      'EventTicketTypes',
      'releationEvent',
      {
        type: Sequelize.INTEGER,
        references: {
			model: 'Events',
			key: 'id'
		},
		onUpdate: 'cascade',
        onDelete: 'cascade'
      },
    );

  },

  down: function(queryInterface, Sequelize) {
    // logic for reverting the changes
    return queryInterface.removeColumn(
      'EventTicketTypes',
      'releationEvent'
    );
  }
};
