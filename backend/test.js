var sql = require('mysql');

var con = sql.createConnection({
    host: '192.168.1.15',
    user: 'testU',
    password: 'pwd',
    port: 3306
});

con.connect(function(err) {
    if(err) throw err;
    console.log('Connected');
})