const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const saltRounds = 10;

  const Admin = sequelize.define('Admin', {
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      }
    },
    password: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM,
      values: ['general', 'support']
    }
  }, {});

  //Admin.associate = function(models) {
  //// associations can be defined here
  //};

  Admin.beforeCreate(admin => {
    return bcrypt.hash(admin.password, saltRounds).then(hash => {
      admin.password = hash;
    });
  });

  return Admin;
};
