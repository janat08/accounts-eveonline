EveonlineHelpers.changeOfOwnerShip = function(userId, char) {
  //placeholder function to delete records which were made by char whose owner who has changed
  //pass in functions to call to update records
}

EveonlineHelpers.refreshAuthToken = function(user, char) {
  var config = ServiceConfiguration.configurations.findOne({service: 'eveonline'});

  if (!config)
    throw new ServiceConfiguration.ConfigError("Service not configured");

  try {
    if(user.services.eveonline.refreshToken.length < 1)
      throw new Error()
  } catch (err) {
    throw new Error("Refresh token not present in user record.");
  }

  var responseContent;
  try {
    responseContent = Meteor.http.post("https://login.eveonline.com/oauth/token", { params: {
      grant_type:    'refresh_token',
      refresh_token: user.services.eveonline[char].refreshToken,
      client_id:     config.clientId,
      client_secret: OAuth.openSecret(config.secret)
    }}).content;
  } catch (err) {
    throw new Error("Failed to refresh auth token.\n\n" + err.message);
  }

  var parsedResponse;
  try {
    parsedResponse = JSON.parse(responseContent);
  } catch (err) {
    throw new Error("Failed to refresh auth token.\n\n" + responseContent);
  }

  if (!parsedResponse.access_token) {
    throw new Error("Failed to refresh auth token.\n\n" + responseContent);
  }

var a= {
  'services.eveonline.'+char+'.accessToken': parsedResponse.access_token,
  'services.eveonline.'+char+'.refreshToken': parsedResponse.refresh_token,
  'services.eveonline.'+char+'.expiresAt': (+new Date) + (1000 * parsedResponse.expires_in)
}

  return Meteor.users.update(user._id, { $set: a});

};
