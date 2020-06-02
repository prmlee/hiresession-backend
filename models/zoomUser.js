module.exports = (sequelize, DataTypes) => {
  const saltRounds = 10;

  const ZoomUsers = sequelize.define(
    'ZoomUsers',
    {
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true
        }
      }
    }
  );

    ZoomUsers.associate = function(models) {
  };


  return ZoomUsers;
};
