import {AccountsServer} from 'accounts-base'

var Ap = AccountsServer.updateOrCreateUserFromExternalService

AccountsServer.updateOrCreateUserFromExternalService = function (
  serviceName,
  serviceData,
  options
) {

  if (serviceName == "eveonline") {
    var selector = {}
    var serviceIdKey = "services.eveonline.list.name"

    selector[serviceIdKey] = serviceData.name;

    var user = this.users.findOne(selector);

// if (serviceData.serviceData.name == "list") {
//   throw new Error("You're black sheep")
// }

    if (user.services.eveonline[serviceData.name].eveAccount != serviceData.eveAccount){
        EveonlineHelpers.changeOwnerShip(user._id, serviceData.name)
// XXX would ideally conduct these operations within update operation instead of js
        delete user.services.eveonline[serviceData.name]
        user.services.eveonline.list.filter((x)=>{
          return x.name == serviceData.name
        })
        this.users.update(user._id, {
          $set: {
            user.services.eveonline.
          }
        })
        user = false
    }


    if (user) {
      pinEncryptedFieldsToUser(serviceData, user._id);

      // We *don't* process options (eg, profile) for update, but we do replace
      // the serviceData (eg, so that we keep an unexpired access token and
      // don't cache old email addresses in serviceData.email).
      // XXX provide an onUpdateUser hook which would let apps update
      //     the profile too
      var setAttrs = {};
      _.each(serviceData, function (value, key) {
        setAttrs["services.eveonline."+ serviceData.name +"."+ key] = value;
      });
      setAttrs =

      // XXX Maybe we should re-use the selector above and notice if the update
      //     touches nothing?
      if(serviceName=="eveonline") {
        this.users.update(user._id, {
          $set: setAttrs
          $addToSet: {"services.eveonline.list": {name: serviceData.name, id: serviceData.id}}
        });
      }

      return {
        type: serviceName,
        userId: user._id
      };

    } else {
      // Create a new user with the service data. Pass other options through to
      // insertUserDoc.
      user = {services: {}};
      user.services[serviceName] = {list: [{name: serviceData.name, id: serviceData.id}]};
      user.services[serviceName][serviceData.name] = serviceData
      return {
        type: serviceName,
        userId: this.insertUserDoc(options, user)
      };
    }

    /// XXX beginning of common/original SSO
  } else {
    Ap(
      serviceName,
      serviceData,
      options
    )
  }
};
