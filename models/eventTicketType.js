
module.exports = (sequelize, DataTypes) => {
    
    const EventTicketTypes = sequelize.define('EventTicketTypes', {
		eventId: DataTypes.INTEGER,
		releationEvent:DataTypes.INTEGER,
		type1:{
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        price_type1:{
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0
        },
        description_type1: {
            type: DataTypes.TEXT
		},
		
		type2:{
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        price_type2:{
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0
        },
        description_type2: {
            type: DataTypes.TEXT
		},
		
		type3:{
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        price_type3:{
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0
        },
        description_type3: {
            type: DataTypes.TEXT
		},
		
		type11:{
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        price_type11:{
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0
        },
        description_type11: {
            type: DataTypes.TEXT
		},
		
		type12:{
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        price_type12:{
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0
        },
        description_type12: {
            type: DataTypes.TEXT
		},
		
		type13:{
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        price_type13:{
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0
        },
        description_type13: {
            type: DataTypes.TEXT
		},
		
		type21:{
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        price_type21:{
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0
        },
        description_type21: {
            type: DataTypes.TEXT
		},
        details:{
            type: DataTypes.TEXT
        }
        
    }, {});
  
    EventTicketTypes.associate = function(models) {
		EventTicketTypes.hasOne(models.Events, {as:'events', foreignKey:'id', sourceKey:'eventId'});
    };

    return EventTicketTypes;
};
  