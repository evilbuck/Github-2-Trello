var q      = require('q');
var key    = process.env.TRELLO_DEVELOPER_PUBLIC_KEY;

var t = require('../config/initializers/trello');

function Push(data) {
  var commitMessage = data.head_commit.message;

  // parse the message
  var trelloIdRegex = /\[fixes #([\w\-]+)\]/i; 


  if (trelloIdRegex.test(commitMessage)) {
    var trelloCardId = commitMessage.match(trelloIdRegex)[1];
    var comments = data.commits.map(function(commit) {
                      return  '([' + commit.id.substr(0, 6) + '](' + commit.url + ')' +
                        ') **' + commit.author.username + '** ' +
                        ': ' + commit.message;
                    }).join('\n');

    return q.nfcall(t.post.bind(t), '/1/cards/' + trelloCardId + '/actions/comments',
                    { text: comments })
           .catch(function(err) {
             if (process.env.DEBUG) {
               console.log('Trello error', err, err.message, trelloCardId);
             }
             return q.reject(err);
           });

  } else {
    return q.resolve({});
  }
}

module.exports = Push;
