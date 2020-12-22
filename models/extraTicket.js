
module.exports = (sequelize, DataTypes) => {
    
    const ExtraTickets = sequelize.define('ExtraTickets', {
        eventTicketId: DataTypes.INTEGER,
        eventId: DataTypes.INTEGER,
		email: DataTypes.STRING,
		roleType: DataTypes.INTEGER,
        isProcess:{
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
    }, {});
  
    ExtraTickets.associate = function(models) {
        ExtraTickets.hasOne(models.Events, {as:'events', foreignKey:'id', sourceKey:'eventId'});
        ExtraTickets.hasOne(models.EventTickets, {as:'eventTickets', foreignKey:'id', sourceKey:'eventTicketId'});
    };

    return ExtraTickets;
};
  