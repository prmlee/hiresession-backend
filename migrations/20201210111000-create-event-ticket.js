'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('EventTickets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      eventId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Events',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
	  },
	  userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
	  
	  mainTicketType:{
		type: Sequelize.INTEGER,
        defaultValue: 0
	  },
      mainTicketPrice:{
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
	  },
	  primaryEmail: {
        type: Sequelize.TEXT
	  },

	  isExtraTicket:{
		type: Sequelize.INTEGER,
        defaultValue: 0
	  },
	  extraTicketType:{
		type: Sequelize.INTEGER,
        defaultValue: 0
	  },
	  extraTicketPrice:{
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      extraTicketCount:{
		type: Sequelize.INTEGER,
        defaultValue: 0
	  },
	  extraEmail1: {
        type: Sequelize.TEXT
	  },
	  extraEmail2: {
        type: Sequelize.TEXT
	  },

	  isResumeTicket:{
		type: Sequelize.INTEGER,
        defaultValue: 0
	  },
	  resumeTicketType:{
		type: Sequelize.INTEGER,
        defaultValue: 0
	  },
	  resumeTicketPrice:{
		type: Sequelize.INTEGER,
        defaultValue: 0
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
    return queryInterface.dropTable('EventTickets');
  }
};
