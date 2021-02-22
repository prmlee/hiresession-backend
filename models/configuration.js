
module.exports = (sequelize, DataTypes) => {
    
    const Configurations = sequelize.define('Configurations', {
        kind: DataTypes.INTEGER,
		type: DataTypes.INTEGER,
		value: DataTypes.TEXT,
	}, {});
	
	Configurations.associate = function(models) {
		
	};
	
    return Configurations;
};
  