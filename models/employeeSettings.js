const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const saltRounds = 10;

  const EmployeeSettings = sequelize.define('employeeSettings', {
    employeeId: DataTypes.INTEGER,
    eventId: DataTypes.INTEGER,
    date: DataTypes.STRING,
    duration: DataTypes.INTEGER,
    timezoneOffset: {
      type: DataTypes.INTEGER,
      defaultValue: 300, // EST TIME
    },
    timezoneName: {
      type: DataTypes.STRING,
      defaultValue: 'EST',
    },
    durationType:  {
      type: DataTypes.ENUM,
      values: ['Min', 'Hours']
    },
    isFull: {
        type: DataTypes.INTEGER,
        defaultValue:0
    },
    startUrl: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    joinUrl: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    password: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    zoomId: {
      type: DataTypes.STRING,
      defaultValue: 'EST',
    }
  }, {});

  EmployeeSettings.associate = function(models) {
    EmployeeSettings.hasMany(models.SettingDurations, {as:'SettingDurations', foreignKey:'settingId'});
    EmployeeSettings.hasOne(models.Events, {as:'events', foreignKey:'id', sourceKey:'eventId'});
  };



  return EmployeeSettings;
};
