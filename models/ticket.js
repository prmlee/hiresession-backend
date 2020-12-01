
module.exports = (sequelize, DataTypes) => {
    
    const Tickets = sequelize.define('Tickets', {
        ticketTypeId: DataTypes.INTEGER,
        paymentId: DataTypes.INTEGER,
        userId: DataTypes.INTEGER,
        count:{
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
    }, {});
  
    Tickets.associate = function(models) {
        Tickets.hasOne(models.TicketTypes, {as:'ticketType', foreignKey:'id', sourceKey:'ticketTypeId'});
        Tickets.hasOne(models.Payments, {as:'payment', foreignKey:'id', sourceKey:'paymentId'});
        Tickets.hasOne(models.User, {as:'user', foreignKey:'id', sourceKey:'userId'});
    };

    return Tickets;
};
  