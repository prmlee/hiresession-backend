'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('EventTicketTypes', {
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
	  
	  type1:{
		type: Sequelize.INTEGER,
        defaultValue: 0
	  },
      price_type1:{
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      description_type1: {
        type: Sequelize.TEXT
	  },

	  type2:{
		type: Sequelize.INTEGER,
        defaultValue: 0
	  },
	  price_type2:{
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      description_type2: {
        type: Sequelize.TEXT
	  },

	  type3:{
		type: Sequelize.INTEGER,
        defaultValue: 0
	  },
	  price_type3:{
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      description_type3: {
        type: Sequelize.TEXT
	  },

	  type11:{
		type: Sequelize.INTEGER,
        defaultValue: 0
	  },
	  price_type11:{
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      description_type11: {
        type: Sequelize.TEXT
	  },
	  
	  type12:{
		type: Sequelize.INTEGER,
        defaultValue: 0
	  },
	  price_type12:{
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      description_type12: {
        type: Sequelize.TEXT
	  },
	  
	  type13:{
		type: Sequelize.INTEGER,
        defaultValue: 0
	  },
	  price_type13:{
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      description_type13: {
        type: Sequelize.TEXT
	  },
	  
	  type21:{
		type: Sequelize.INTEGER,
        defaultValue: 0
	  },
	  price_type21:{
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      description_type21: {
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
    return queryInterface.dropTable('EventTicketTypes');
  }
};
