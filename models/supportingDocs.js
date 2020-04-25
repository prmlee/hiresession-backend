
module.exports = (sequelize, DataTypes) => {

  const SupportingDocs = sequelize.define('SupportingDocuments', {
    userId: DataTypes.INTEGER,
    docName: DataTypes.STRING,
  }, {});

  SupportingDocs.associate = function(models) {
  // associations can be defined here
  };

  return SupportingDocs;
};
