#Github 2 Trello

## What is it?
Github2Trello provides support for push and pull_request webhooks from
github.

- **pull_request**: the `pull_request` event will move your trello card
  to a designated *pull request* list in Trello.
- **push**: the `push` event will create a comment on the specified
  Trello card containing the commit messages and a link to the `HEAD` commit


## Install

###Trello setup
1. create your trello access token
  1. get your application access key by visiting https://trello.com/app-key
  1. copy your application key. 
  1. paste https://trello.com/1/authorize?key=substitutewithyourapplicationkey&name=MyGithub2Trello&expiration=never&response_type=token&scope=read,write in your browser with your application key
1. set some environment variables on your server 
  1. `export TRELLO_TOKEN=<token_from_last_step>`
  1. `export TRELLO_DEVELOPER_PUBLIC_KEY=<key_from_last_step>`
1. Get the Trello list id you use for pull requests
  1. create or open a card that is on your "pull requested" list
  1. click "share and more"
  1. click "export json"
  1. search for `idList` and grab the id associated with the `idList`
     property
1. set an environment variable on your server for the pull request list
   `export TRELLO_PR_LIST_ID=<id_from_previous_idList_step>`


###Github setup, I'm assuming you have two factor authentication enabled because you're security conscious
1. create a personal access token via https://github.com/settings/applications 
1. `curl -i -u <your_username> -H "X-GitHub-OTP: <your_2fa_OTP_code_from_your_device_or_text_message>" \
    -d '{"scopes": ["repo", "user"], "note": "Github2Trello"}' \
    https://api.github.com/authorizations`
1. set an environment variable on your server `export GITHUB_TOKEN=<token_you_just_received>`

####Webhooks
1. visit your project page
1. click "settings"
1. click "webhooks & services"
1. click "add webhook"
1. In the payload url field, enter the url/ip where Github2Trello is
   installed with a path of `/github`. e.g. `http://mygithub2url.com/github`
1. ensure "content-type" is application/json
1. For "which events would you like to trigger this webhook", select "Send me everything"
1. Ensure that "active" is checked.

####Github token

## How to use
In the commit message include `[Fixes #<trello_card_id>]` anywhere in
the commit message. This will let Github2Trello know which Trello card
to take action on.

Enjoy,
  -- Buckley
