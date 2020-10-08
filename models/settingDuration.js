const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const saltRounds = 10;

  const SettingDurations = sequelize.define('SettingDurations', {
    settingId: DataTypes.INTEGER,
    startTime: DataTypes.TIME,
    endTime: DataTypes.TIME,
  }, {});

  SettingDurations.associate = function(models) {

  };



  return SettingDurations;
};
