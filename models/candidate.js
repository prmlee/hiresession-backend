
module.exports = (sequelize, DataTypes) => {

  const Candidate = sequelize.define('Candidates', {
    userId: DataTypes.INTEGER,
    major: DataTypes.STRING,
    shcool: DataTypes.STRING,
    graduationYear: DataTypes.INTEGER,
    highDeagree: DataTypes.STRING,
    desiredJobTitle: DataTypes.STRING,
    resume: DataTypes.STRING,
    resumeFileName: DataTypes.STRING,
    profileImg: DataTypes.STRING,
    phone: DataTypes.STRING,
    specialNeeds: DataTypes.TEXT,
    city: DataTypes.TEXT,
    state: DataTypes.TEXT,
    career: DataTypes.TEXT,
    zipCode: DataTypes.STRING,
    industryInterested:DataTypes.STRING,
    aboutMe: DataTypes.TEXT,
    share: DataTypes.INTEGER,
    isYouMilitary: DataTypes.INTEGER,
    isFamilyMilitary: DataTypes.INTEGER,
  }, {});

  Candidate.associate = function(models) {
  // associations can be defined here
  };

  return Candidate;
};
