const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const saltRounds = 10;

  const EmployeeSettings = sequelize.define('employeeSettings', {
    employeeId: DataTypes.INTEGER,
    eventId: DataTypes.INTEGER,
    date: DataTypes.STRING,
    duration: DataTypes.INTEGER,
    durationType:  {
      type: DataTypes.ENUM,
      values: ['Min', 'Hours']
    },
  }, {});

  EmployeeSettings.associate = function(models) {
    EmployeeSettings.hasMany(models.SettingDurations, {as:'SettingDurations', foreignKey:'settingId'});
    EmployeeSettings.hasOne(models.Events, {as:'events', foreignKey:'id', sourceKey:'eventId'});
  };



  return EmployeeSettings;
};
