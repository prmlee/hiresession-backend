
module.exports = (sequelize, DataTypes) => {

  const AttachedEmployees = sequelize.define('AttachedEmployees', {
    userId: DataTypes.INTEGER,
    EventId: DataTypes.INTEGER,
  }, {});

  AttachedEmployees.associate = function(models) {
  };

  return AttachedEmployees;
};
