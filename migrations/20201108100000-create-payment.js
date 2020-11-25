'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      paymentId: {
        type: Sequelize.STRING
      },
      amount:{
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      last4: {
        type: Sequelize.TEXT
      },
      firstName: {
        type: Sequelize.TEXT
      },
      lastName: {
        type: Sequelize.TEXT
      },
      email: {
        type: Sequelize.TEXT
      },
      address: {
        type: Sequelize.TEXT
      },
      city: {
        type: Sequelize.TEXT
      },
      stateProvince: {
        type: Sequelize.TEXT
      },
      zipPostalCode: {
        type: Sequelize.TEXT
      },
      billedContact: {
        type: Sequelize.TEXT
      },
      companyName: {
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
    return queryInterface.dropTable('Payments');
  }
};
