
module.exports = (sequelize, DataTypes) => {

  const SupportingDocs = sequelize.define('SupportingDocuments', {
    userId: DataTypes.INTEGER,
    docName: DataTypes.STRING,
    docFileName: DataTypes.STRING,
    fileSize: DataTypes.STRING,
  }, {});

  SupportingDocs.associate = function(models) {
  // associations can be defined here
  };

  return SupportingDocs;
};
