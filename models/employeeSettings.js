const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const saltRounds = 10;

  const Admin = sequelize.define('employeeSettings', {
    employeeId: DataTypes.INTEGER,
    date: DataTypes.DATE,
    startTimeFrom: DataTypes.TIME,
    startTimeTo: DataTypes.TIME,
    endTimeFrom: DataTypes.TIME,
    endTimeTo: DataTypes.TIME,
    duration: DataTypes.INTEGER,
    durationType:  {
      type: DataTypes.ENUM,
      values: ['Min', 'Hours']
    },
  }, {});

  Admin.associate = function(models) {

  };



  return Admin;
};
