var Github = require('github');
var q      = require('q');
var githubToken = process.env.GITHUB_TOKEN;

var t = require('../../config/initializers/trello');
var prListId = t.PR_LIST_ID;

var gh = new Github({
  version: '3.0.0',
  debug: true
});

function parseCommit(commitMessage) {
  var trelloCardId;
  var trelloIdRegex = /\[fixes #(.+?)\]/im;

  console.log('\n\ncommit message', commitMessage, '\n\n');
  if (trelloIdRegex.test(commitMessage)) {
    // TODO: handle multiple cards in one commit
    trelloCardId = commitMessage.match(trelloIdRegex)[1];
    return encodeURIComponent(trelloCardId);
  }

  return null;
}

function authenticateGithub() {
  gh.authenticate({
    type: 'oauth',
    token: githubToken
  });
}

function PullRequest(data) {
  var trelloCardId;
  var sha;

  sha = data.pull_request.base.sha;

  var params = {
    user: data.pull_request.user.login,
    repo: data.repository.name,
    number: data.pull_request.number
  };
  
  authenticateGithub();
  // get commits and commit messages
  return q.nfcall(gh.pullRequests.getCommits.bind(gh.pullRequests), params).then(function(ghRes) {
    // TODO: find multiple instances of the [Fixes #<id>] syntax
    var trelloCards = ghRes.reduce(function(memo, prCommit) {
      var cardId = parseCommit(prCommit.commit.message);
      console.log('cardId:', cardId);
      if (cardId !== null) {
        memo.push(cardId);
      }

      return memo;
    }, []);

    return trelloCards;
  }, function(err) { console.error("things fucked up:", err, params); })
  .then(function(commits) {
    var comments = data.pull_request.html_url;
    // move all trello cards to Pull Requested list
    var moveCards = commits.map(function(trelloCardId) {
      return q.nfcall(t.put.bind(t), '/1/cards/' + trelloCardId + '/idList', { value: prListId });
    });

    moveCards = moveCards.concat(commits.map(function(trelloCardId) {
      q.nfcall(t.post.bind(t), '/1/cards/' + trelloCardId + '/actions/comments',
        { text: comments })
      .catch(function(err) {
        if (process.env.DEBUG) {
          console.log('Trello error', err, err.message, trelloCardId);
        }
        return q.reject(err);
      });
    }));

    return q.all(moveCards);
  });
}

module.exports = PullRequest;
