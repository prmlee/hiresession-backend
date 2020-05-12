
module.exports = (sequelize, DataTypes) => {

  const Candidate = sequelize.define('Candidates', {
    userId: DataTypes.INTEGER,
    major: DataTypes.STRING,
    shcool: DataTypes.STRING,
    graduationYear: DataTypes.INTEGER,
    highDeagree: DataTypes.STRING,
    desiredJobTitle: DataTypes.STRING,
    resume: DataTypes.STRING,
    zipCode: DataTypes.STRING,
    industryInterested:{
      type: DataTypes.ENUM,
      values: ['html', 'css']
    },
  }, {});

  Candidate.associate = function(models) {
  // associations can be defined here
  };

  return Candidate;
};
