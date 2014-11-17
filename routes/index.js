var XINGApi = require('xing-api'),
    router  = require('express').Router(),
    xingApi  = new XINGApi({
      consumerKey: 'deadbeef', // put your credentials here
      consumerSecret: 'aSecret', // put your credentials here
      oauthCallback: 'http://localhost:3000/oauth_callback'
    });

router.get('/', function (req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/authorize', function (req, res) {
  xingApi.getRequestToken(function (oauthToken, oauthTokenSecret, authorizeUrl) {
    res.cookie('requestToken',
      JSON.stringify({ token: oauthToken, secret: oauthTokenSecret }),
      { signed: true });

    res.redirect(authorizeUrl);
  });
});

router.get('/oauth_callback', function (req, res) {
  var requestToken = JSON.parse(req.signedCookies.requestToken);

  xingApi.getAccessToken(requestToken.token, requestToken.secret, req.query.oauth_verifier,
    function (error, oauthToken, oauthTokenSecret, results) {
      var client = xingApi.client(oauthToken, oauthTokenSecret);

      client.put('/v1/users/me/web_profiles/twitter', { 'url[]': 'https://twitter.com/volkertietz' }, function (error, response) {
        res.render('oauth_callback', { users: response });
      });
    });
});

module.exports = router;
