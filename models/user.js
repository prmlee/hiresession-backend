const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const saltRounds = 10;

  const User = sequelize.define(
    'User',
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true
        }
      },
      password: DataTypes.STRING,
      role: {
          type: DataTypes.ENUM,
          values: ['candidate', 'employer']
      },
      status: {
          type: DataTypes.ENUM,
          values: ['active', 'inactive']
      },
    }
  );

  User.associate = function(models) {
    User.hasOne(models.Employees, {as:'employee', foreignKey:'userId'});
    User.hasMany(models.SupportingDocuments, {as:'SupportingDocuments', foreignKey:'userId'});
    User.hasOne(models.Candidates, {as:'candidate', foreignKey:'userId'});
    User.hasMany(models.AttachedEmployees, {as:'attached', foreignKey:'userId', sourceKey:'id'});
    User.hasOne(models.Events, {as:'events', foreignKey:'userId', sourceKey:'id'});
    User.hasMany(models.Interviews, {as:'interviews', foreignKey:'candidateId'});
    User.hasMany(models.Interviews, {as:'interview', foreignKey:'employeeId'});
    User.hasMany(models.AttachedEmployees, {as:'attachedEmployees', foreignKey:'userId',  sourceKey:'id'});
    User.hasMany(models.employeeSettings, {as:'employeeSettings', foreignKey:'employeeId',  sourceKey:'id'});
  };

  User.beforeBulkUpdate(user => {
    return user.attributes.password ? bcrypt.hash(user.attributes.password, saltRounds).then(function(hash) {
      user.attributes.password = hash;
    }): user;
  });

  return User;
};
