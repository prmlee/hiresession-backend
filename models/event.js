const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const saltRounds = 10;

  const Events = sequelize.define('Events', {
    eventName: DataTypes.STRING,
    bizaboLink: DataTypes.STRING,
    eventLogo: DataTypes.STRING,
    date: DataTypes.DATE,
    startTime: DataTypes.TIME,
    endTime: DataTypes.TIME,


  }, {});

  Events.associate = function(models) {
    Events.hasMany(models.AttachedEmployees, {as:'attachedEmployees', foreignKey:'EventId', sourceKey:'id'});
  };



  return Events;
};
