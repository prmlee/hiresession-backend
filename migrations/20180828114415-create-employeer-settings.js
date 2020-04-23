'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('employeeSettings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      employeeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      date: {
        type: Sequelize.DATEONLY
      },
      startTimeFrom: {
        type: Sequelize.TIME
      },
      startTimeTo: {
        type: Sequelize.TIME
      },
      endTimeFrom: {
        type: Sequelize.TIME
      },

      endTimeTo: {
        type: Sequelize.TIME
      },
      duration: {
        type: Sequelize.INTEGER
      },
      durationType: {
        type: Sequelize.ENUM,
        values: ['Min', 'Hours'],
        defaultValue: 'Min'
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
    return queryInterface.dropTable('Admins');
  }
};
