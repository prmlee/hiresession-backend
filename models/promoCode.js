
module.exports = (sequelize, DataTypes) => {
    
    const PromoCodes = sequelize.define('PromoCodes', {
		code: DataTypes.STRING,
		ticketTypeId: DataTypes.INTEGER,
		percent: DataTypes.INTEGER,
    }, {});
  
    PromoCodes.associate = function(models) {
		PromoCodes.hasOne(models.EventTicketTypes, {as:'eventTicketTypes', foreignKey:'id', sourceKey:'ticketTypeId'});
	};
    return PromoCodes;
};