//holds secret and id tokens for
Eveonline.requestCredential = function (options, credentialRequestCompleteCallback) {
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  }

  var config = ServiceConfiguration.configurations.findOne({service: 'eveonline'});

  if (!config) {
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(new ServiceConfiguration.ConfigError("Service not configured"));
    return;
  }

  var credentialToken = encodeURIComponent(Random.id());
  var loginStyle = OAuth._loginStyle('eveonline', config, options);
  var scope = (typeof options.scope != 'undefined') ? options.scope : 'publicData';

  var loginUrl = "https://login.eveonline.com/oauth/authorize" +
    '?response_type=code' +
		'&client_id=' + config.clientId +
    '&redirect_uri=' + encodeURIComponent(Meteor.absoluteUrl("_oauth/eveonline?close")) +
    '&scope=' + 'characterAccountRead corporationMembersRead esi-mail.send_mail.v1 esi-skills.read_skills.v1 esi-skills.read_skillqueue.v1 esi-wallet.read_character_wallet.v1 esi-characters.read_corporation_roles.v1' +
		'&state=' + OAuth._stateParam(loginStyle, credentialToken);

  OAuth.initiateLogin(credentialToken, loginUrl, credentialRequestCompleteCallback);
};
