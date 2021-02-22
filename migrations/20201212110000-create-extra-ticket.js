'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ExtraTickets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      eventTicketId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'EventTickets',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
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
      email: {
        type: Sequelize.STRING
	  },
	  roleType:{
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      isProcess:{
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
    return queryInterface.dropTable('ExtraTickets');
  }
};
