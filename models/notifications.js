
module.exports = (sequelize, DataTypes) => {
    
    const Notifications = sequelize.define('Notifications', {
		userId: DataTypes.INTEGER,
        type:DataTypes.INTEGER,
        param1: DataTypes.STRING,
        param2: DataTypes.STRING        
    }, {});
  
    Notifications.associate = function(models) {
		Notifications.hasOne(models.User, {as:'user', foreignKey:'id', sourceKey:'userId'});
    };

    return Notifications;
};