'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Candidates', {
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
      shcool: {
        type: Sequelize.STRING,
        allowNull:true
      },
      major: {
        type: Sequelize.STRING,
        allowNull:true
      },
      zipCode: {
        type: Sequelize.STRING,
        allowNull:true
      },
      profileImg: {
        type: Sequelize.STRING,
        allowNull:true
      },
      specialNeeds: {
        type: Sequelize.STRING,
        allowNull:true
      },
      highDeagree:{
        type: Sequelize.STRING,
        allowNull:true
      },
      resume:{
        type: Sequelize.STRING,
        allowNull:true
      },
      graduationYear:{
        type: Sequelize.INTEGER,
        allowNull:true
      },
      desiredJobTitle:{
        type: Sequelize.STRING,
        allowNull:true
      },
      phone:{
        type: Sequelize.STRING,
        allowNull:true
      },
      industryInterested: {
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
    return queryInterface.dropTable('Candidate');
  }
};
