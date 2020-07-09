var mysqlDump = require('mysqldump');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];


module.exports = function(){
    var param = {
		host: config.host,
		user: config.username,
		password: config.password,
		database: config.database,
		dest: '/var/backup/' + Date.now() + '-' + config.database + '.sql'
	};
    //console.log(param);
	mysqlDump( param, function(err){
		if(err){
			console.log(err);
		}else{
			console.log("Success");
		}
	});
}
