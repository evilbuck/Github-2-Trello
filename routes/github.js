var express = require('express');
var router = express.Router();
var Github = require('github');
var q = require('q');


// TODO: this should be in a resque or other queue

router.all('/', function(req, res, next) {
  var commitMessage;
  // route based on event type
  var eventType = req.headers['x-github-event'];
  var data = req.body;
  var hookHandler;

  // TODO: verify secret

  if (process.env.DEBUG) {
    console.log("**** " + eventType + " " + new Date() + "****");
    console.log(data);
    console.log("**** /" + eventType + " " + new Date() + "****");
  }

  var events = ['push', 'pull_request'];
  var pull_request_actions = [ 'opened', 'closed' ];

  switch(eventType) {
    case "push":
      hookHandler = require('../event_handlers/' + eventType)(data);
      break;
      
    case "pull_request":
      hookHandler = require('../event_handlers/pull_request/' + data.action)(data);
      break;
      
    default:
      hookHandler = q.resolve();
  }

  hookHandler.then(function(data) {
    res.status(200).json(data);
  })
  .catch(function(err) {
    console.error('Error:', err, err.message);
    res.status(500).json({ errors: [ err.message ] });
  });
});

module.exports = router;
