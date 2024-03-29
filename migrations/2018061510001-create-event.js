'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      eventName: {
        type: Sequelize.STRING,
        allowNull:true
      },
      eventLogo:{
        type: Sequelize.STRING,
        allowNull:true
      },
      pdfFile:{
        type: Sequelize.STRING,
        allowNull:true
      },
      bizaboLink:{
        type: Sequelize.STRING,
        allowNull:true
      },
      location:{
        type: Sequelize.STRING,
        allowNull:true
      },
      date: {
        type: Sequelize.DATEONLY
      },
      startTime: {
        type: Sequelize.TIME
      },
      endTime: {
        type: Sequelize.TIME
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
