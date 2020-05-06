const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const saltRounds = 10;

  const EmployeeSettings = sequelize.define('SettingDurations', {
    settingId: DataTypes.INTEGER,
    startTime: DataTypes.TIME,
    endTime: DataTypes.TIME,
  }, {});

  EmployeeSettings.associate = function(models) {

  };



  return EmployeeSettings;
};
