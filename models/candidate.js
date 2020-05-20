
module.exports = (sequelize, DataTypes) => {

  const Candidate = sequelize.define('Candidates', {
    userId: DataTypes.INTEGER,
    major: DataTypes.STRING,
    shcool: DataTypes.STRING,
    graduationYear: DataTypes.INTEGER,
    highDeagree: DataTypes.STRING,
    desiredJobTitle: DataTypes.STRING,
    resume: DataTypes.STRING,
    profileImg: DataTypes.STRING,
    phone: DataTypes.STRING,
    specialNeeds: DataTypes.TEXT,
    zipCode: DataTypes.STRING,
    industryInterested:DataTypes.STRING,
  }, {});

  Candidate.associate = function(models) {
  // associations can be defined here
  };

  return Candidate;
};
