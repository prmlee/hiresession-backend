import mysqldump from 'mysqldump';



exports.dbAutoBackUp = () =>{
    var strFileName = "/var/backup/bk"+Date.now()+".sql";
    mysqldump({
        connection: {
            host: 'localhost',
            user: 'root',
            password: 'Hiresession1234$',
            database: 'hiresession',
        },
        dumpToFile: strFileName,
    });
}

