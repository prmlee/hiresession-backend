const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const saltRounds = 10;

  const Events = sequelize.define('Events', {
    userId: DataTypes.INTEGER,
    eventName: DataTypes.STRING,
    eventLogo: DataTypes.STRING,
    date: DataTypes.DATE,
    startTime: DataTypes.TIME,
    endTime: DataTypes.TIME,
  }, {});

  Events.associate = function(models) {

  };



  return Events;
};
