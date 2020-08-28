const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const saltRounds = 10;

  const Events = sequelize.define('Events', {
    eventName: DataTypes.STRING,
    bizaboLink: DataTypes.STRING,
    eventLogo: DataTypes.STRING,
    pdfFile: DataTypes.STRING,
    pdfFileName: DataTypes.STRING,
    date: DataTypes.DATE,
    startTime: DataTypes.TIME,
    endTime: DataTypes.TIME,
    location: DataTypes.STRING,
    timezoneOffset: {
      type: DataTypes.INTEGER,
      defaultValue: 300, // EST TIME
    },
    timezoneName: {
      type: DataTypes.STRING,
      defaultValue: 'EST',
    },
    type:{
      type: DataTypes.ENUM,
      values: ['private', 'group'],
      defaultValue: 'private'
    },
  }, {});

  Events.associate = function(models) {
    Events.hasMany(models.AttachedEmployees, {as:'attachedEmployees', foreignKey:'EventId', sourceKey:'id'});
    Events.hasMany(models.AttachedEmployees, {as:'involvedEmployers', foreignKey:'EventId', sourceKey:'id'});
    Events.hasMany(models.Interviews, {as:'interview', foreignKey:'eventId', sourceKey:'id'});
    Events.hasMany(models.employeeSettings,{as:'employeeSettings',foreignKey:'eventId',sourceKey:'id'});
  };



  return Events;
};
