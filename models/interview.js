
module.exports = (sequelize, DataTypes) => {
  const saltRounds = 10;

  const Interviews = sequelize.define('Interviews', {
    employeeId: DataTypes.INTEGER,
    candidateId: DataTypes.INTEGER,
    eventId: DataTypes.INTEGER,
    date: DataTypes.STRING,
    startTime: DataTypes.TIME,
    endTime: DataTypes.TIME,
    note: DataTypes.TEXT,
    employeeNote: DataTypes.TEXT,
    startUrl: DataTypes.STRING,
    meetingId: DataTypes.STRING,
    joinUrl: DataTypes.STRING,
    attachedFile: DataTypes.STRING,
    attachedFileName: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM,
      values: ['interviewed', 'canceled','upcoming']
    },
    rating:DataTypes.INTEGER,
    timezoneOffset: {
      type: DataTypes.INTEGER,
      defaultValue: 300, // EST TIME
    },
    timezoneName: {
      type: DataTypes.STRING,
      defaultValue: 'EST',
    },
  }, {});

  Interviews.associate = function(models) {
    Interviews.hasOne(models.User, {as:'Company', foreignKey:'id', sourceKey:'employeeId'});
    Interviews.hasOne(models.User, {as:'Candidate', foreignKey:'id', sourceKey:'candidateId'});
    Interviews.hasOne(models.Events, {as:'events', foreignKey:'id', sourceKey:'eventId'});
  };



  return Interviews;
};
