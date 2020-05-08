
module.exports = (sequelize, DataTypes) => {

  const AttachedEmployees = sequelize.define('AttachedEmployees', {
    userId: DataTypes.INTEGER,
    EventId: DataTypes.INTEGER,
  }, {});

  AttachedEmployees.associate = function(models) {
    AttachedEmployees.hasOne(models.Events, {as:'events', foreignKey:'userId', sourceKey:'id'});
  };

  return AttachedEmployees;
};
