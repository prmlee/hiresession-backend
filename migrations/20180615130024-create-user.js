'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING
      },
      shcool: {
        type: Sequelize.STRING,
        allowNull:true
      },
      major: {
        type: Sequelize.STRING,
        allowNull:true
      },
      companyName: {
        type: Sequelize.STRING,
        allowNull:true
      },
      JobTitle: {
        type: Sequelize.STRING,
        allowNull:true
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      lastName: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      profileImg:{
        type: Sequelize.STRING,
        allowNull:true
      },
      companyImg:{
        type: Sequelize.STRING,
        allowNull:true
      },
      status: {
        type: Sequelize.ENUM,
        values: ['active', 'inactive'],
        defaultValue: 'active'
      },
      role: {
        type: Sequelize.ENUM,
        values: ['candidate', 'employer'],
        defaultValue: 'candidate'
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
    return queryInterface.dropTable('Users');
  }
};
