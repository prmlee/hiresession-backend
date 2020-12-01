'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('TicketTypes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
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
      role: {
        type: Sequelize.ENUM,
        values: ['Sponsor', 'Exhibitor','Extra Reps','Resume Database'],
      },
      price:{
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      description: {
        type: Sequelize.TEXT
      },
      ticketPerOrder:{
        type: Sequelize.INTEGER,
        defaultValue: 1
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
    return queryInterface.dropTable('TicketTypes');
  }
};
