
module.exports = (sequelize, DataTypes) => {
    
    const Payments = sequelize.define('Payments', {
        paymentId: {
            type: DataTypes.STRING
		},
		eventTicketId: DataTypes.INTEGER,
        amount:{
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0
        },
        last4: {
            type: DataTypes.TEXT
        },
        firstName: {
            type: DataTypes.TEXT
        },
        lastName: {
            type: DataTypes.TEXT
        },
        email: {
            type: DataTypes.TEXT
        },
        address: {
            type: DataTypes.TEXT
        },
        city: {
            type: DataTypes.TEXT
        },
        stateProvince: {
            type: DataTypes.TEXT
          },
          zipPostalCode: {
            type: DataTypes.TEXT
        },
        billedContact: {
            type: DataTypes.TEXT
        },
        companyName: {
            type: DataTypes.TEXT
          },
	}, {});
	
	Payments.associate = function(models) {
		Payments.hasOne(models.EventTickets, {as:'eventTickets', foreignKey:'id', sourceKey:'eventTicketId'});
    };

    return Payments;
};
  