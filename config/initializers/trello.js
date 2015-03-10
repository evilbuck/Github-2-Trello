var Trello = require('node-trello');
var token  = process.env.TRELLO_TOKEN;
var key    = process.env.TRELLO_DEVELOPER_PUBLIC_KEY;

var t  = new Trello(key, token);

t.PR_LIST_ID = process.env.TRELLO_PR_LIST_ID;

module.exports = t;
