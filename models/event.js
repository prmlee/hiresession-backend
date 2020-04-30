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
    startUrl: DataTypes.STRING,
    meetingId: DataTypes.STRING,
    joinUrl: DataTypes.STRING,
    status: DataTypes.STRING,

  }, {});

  Events.associate = function(models) {
    Events.hasOne(models.User, {as:'users', foreignKey:'id', sourceKey:'userId'})
  };



  return Events;
};
