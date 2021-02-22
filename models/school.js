
module.exports = (sequelize, DataTypes) => {
    
    const Schools = sequelize.define('Schools', {
		schoolName: DataTypes.STRING,
    }, {});
  
    Schools.associate = function(models) {
	};
	

    return Schools;
};
  