'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Employees', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      companyName: {
        type: Sequelize.STRING,
        allowNull:true
      },
      JobTitle: {
        type: Sequelize.STRING,
        allowNull:true
      },
      profileImg:{
        type: Sequelize.STRING,
        allowNull:true
      },
      companyImg:{
        type: Sequelize.STRING,
        allowNull:true
      },
      videoUrl:{
        type: Sequelize.STRING,
        allowNull:true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('Employee');
  }
};
