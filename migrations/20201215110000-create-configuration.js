'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Configurations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
	  },
	  kind:{
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      type: {
        type: Sequelize.INTEGER,
        defaultValue: 0
	  },
	  value: {
        type: Sequelize.TEXT
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
    return queryInterface.dropTable('Configurations');
  }
};
