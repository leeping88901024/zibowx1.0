var fs = require('fs');

fs.readFile(__dirname + '/admin/test.txt', {flag: 'r+', encoding: 'utf8'}, function (err, data) {
    if(err) {
        console.error(err);
        return;
    }
    console.log(JSON.stringify(data));
});