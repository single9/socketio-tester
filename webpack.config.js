let noder = require('gt-pack').noder;

let List = [
    require('./src/webpack.config.js')
];

module.exports = noder(List);
