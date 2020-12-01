
module.exports = (sequelize, DataTypes) => {
    
    const ExtraTickets = sequelize.define('ExtraTickets', {
        ticketId: DataTypes.INTEGER,
        eventId: DataTypes.INTEGER,
        email: DataTypes.STRING,
        isProcess:{
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
    }, {});
  
    ExtraTickets.associate = function(models) {
        ExtraTickets.hasOne(models.Events, {as:'events', foreignKey:'id', sourceKey:'eventId'});
        ExtraTickets.hasOne(models.Tickets, {as:'tickets', foreignKey:'id', sourceKey:'ticketId'});

    };

    return ExtraTickets;
};
  