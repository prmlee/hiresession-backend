'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('PromoCodes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      code: {
        type: Sequelize.STRING
	  },
	  ticketTypeId:{
		type:Sequelize.INTEGER,
		references: {
			model: 'EventTicketTypes',
			key: 'id'
		},
		onUpdate: 'cascade',
		onDelete: 'cascade'
	  },
	  percent:{
		  type: Sequelize.INTEGER,
	  },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('PromoCodes');
  }
};
