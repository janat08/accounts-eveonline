if (typeof Eveonline === 'undefined') {
  Eveonline = {};
}

if (typeof EveonlineHelpers === 'undefined') {
  EveonlineHelpers = {};
}

Accounts.oauth.registerService('eveonline');//simply adds index for .id field on server
//https://github.com/meteor/meteor/blob/87681c8f166641c6c3e34958032a5a070aa2d11a/packages/accounts-oauth/oauth_common.js
Meteor.users._ensureIndex("services.eveonline.list.name", {sparse: 1})


if (Meteor.isClient) {
  Meteor.loginWithEveonline = function(options, callback) {
    if (! callback && typeof options === "function") {
      callback = options;
      options = null;
    }

    var credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback);
    Eveonline.requestCredential(options, credentialRequestCompleteCallback);
  };
} else {
  Accounts.addAutopublishFields({
    forLoggedInUser: ['services.eveonline'],
    forOtherUsers: []
  });
}
