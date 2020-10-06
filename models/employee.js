
module.exports = (sequelize, DataTypes) => {

  const Employee = sequelize.define('Employees', {
    userId: DataTypes.INTEGER,
    companyName: DataTypes.STRING,
    profileImg: DataTypes.STRING,
    companyImg: DataTypes.STRING,
    videoUrl: DataTypes.STRING,
    JobTitle: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    phone: DataTypes.STRING,
    isSearchable: {
      type: DataTypes.INTEGER,
      defaultValue:0
    },
  }, {});

  Employee.associate = function(models) {
    Employee.hasMany(models.Events, {as:'events', foreignKey:'eventId', sourceKey:'id'});
    Employee.hasOne(models.User, {as:'users', foreignKey:'id', sourceKey:'userId'});
  };

  return Employee;
};
