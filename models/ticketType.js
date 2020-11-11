
module.exports = (sequelize, DataTypes) => {
    
    const TicketTypes = sequelize.define('TicketTypes', {
        name: DataTypes.STRING,
        eventId: DataTypes.INTEGER,
        role: {
            type: DataTypes.ENUM,
            values: ['Sponsor', 'Exhibitor']
        },
        price:{
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0
        },
        description: {
            type: DataTypes.TEXT
        },
        ticketPerOrder:{
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
    }, {});
  
    TicketTypes.associate = function(models) {
      TicketTypes.hasOne(models.Events, {as:'events', foreignKey:'id', sourceKey:'eventId'});
    };

    return TicketTypes;
};
  