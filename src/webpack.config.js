let gtPack = require('gt-pack');

let html = gtPack.GuanTing({
    dirName: process.cwd() + '/built/assets/',
    html: {
        index: __dirname + '/views/index.ejs',
        dirName: process.cwd() + '/built/views/'
    },
    js: {
        index: __dirname + '/views/js/index.js'
    },
    css: {
        index: __dirname + '/views/less/index.less'
    }
});

module.exports = html;