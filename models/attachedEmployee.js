
module.exports = (sequelize, DataTypes) => {

  const AttachedEmployees = sequelize.define('AttachedEmployees', {
    userId: DataTypes.INTEGER,
    EventId: DataTypes.INTEGER,
  }, {});

  AttachedEmployees.associate = function(models) {
    AttachedEmployees.hasOne(models.Events, {as:'events', foreignKey:'id', sourceKey:'EventId'});
    AttachedEmployees.hasOne(models.User, {as:'Company', foreignKey:'id', sourceKey:'userId'})

  };

  return AttachedEmployees;
};
