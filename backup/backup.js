var fs = require('fs');
var spawn = require('child_process').spawn;


var mysqldump = spawn('mysqldump', [
    '-u',
    'root',
    '-p',
    'Hiresession1234$',
    'hiresession',
]);

exports.dbAutoBackUp = () =>{
    var strFileName = "/var/backup/bk"+Date.now()+".sql";
    var wstream = fs.createWriteStream(strFileName);
    mysqldump.stdout.pipe(wstream)
    .on('finish', function () {
        console.log('Completed')
    })
    .on('error', function (err) {
        console.log(err)
    });
}

