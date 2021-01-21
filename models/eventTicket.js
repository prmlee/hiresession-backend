
module.exports = (sequelize, DataTypes) => {
    
    const EventTickets = sequelize.define('EventTickets', {
		eventId: DataTypes.INTEGER,
		userId: DataTypes.INTEGER,
		releationEvent:DataTypes.INTEGER,
		
		mainTicketType:{
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        mainTicketPrice:{
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0
        },
        primaryEmail: {
            type: DataTypes.TEXT
		},
		
		isExtraTicket:{
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
		extraTicketType:{
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        extraTicketPrice:{
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0
		},
		extraTicketCount:{
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        extraEmail1: {
            type: DataTypes.TEXT
		},
		extraEmail2: {
            type: DataTypes.TEXT
		},
		
		
		isResumeTicket:{
            type: DataTypes.INTEGER,
            defaultValue: 0
		},
		resumeTicketType:{
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        resumeTicketPrice:{
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0
        }
        
    }, {});
  
    EventTickets.associate = function(models) {
		EventTickets.hasOne(models.Events, {as:'events', foreignKey:'id', sourceKey:'eventId'});
		EventTickets.hasMany(models.Payments, {as:'payment', foreignKey:'eventTicketId', sourceKey:'id'});
		EventTickets.hasOne(models.User, {as:'user', foreignKey:'id', sourceKey:'userId'});
    };

    return EventTickets;
};
  