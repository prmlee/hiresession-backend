
module.exports = (sequelize, DataTypes) => {
  const SupportingDocs = sequelize.define('Favorits', {
    candidateId: DataTypes.INTEGER,
    employeeId: DataTypes.INTEGER,
  }, {});

  SupportingDocs.associate = function(models) {
  };

  return SupportingDocs;
};
