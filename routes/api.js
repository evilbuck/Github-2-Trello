var token, key, t, Trello;

Trello = require('node-trello');
t     = new Trello(key, token);
token = process.env.TRELLO_TOKEN;
key   = process.env.TRELLO_KEY;
prListId = process.env.TRELLO_PR_LIST;

exports.pull_request = function(req, res) {
  var data, pullRequest, trelloIdRegex, trelloCardId;

  trelloIdRegex = /\[fixes #([\w\-]+)\]/i;

  data = req.body;
  pullRequest = data.pull_request;
  // parse title for [Fixes #<number>]
  if (trelloIdRegex.test(pullRequest.title)) {
    trelloCardId = pullRequest.title.match(trelloIdRegex)[1];

    t.put('/1/cards/' + trelloCardId, { idList: prListId }, function(err, res){
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(res);
      }
    });

    // move the trello card to the PR list
  } else {
    res.status(200).json({no_list: true});
  }
};
