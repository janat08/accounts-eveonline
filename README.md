# accounts-eveonline

Meteor.js authentication with EvE Online SSO

## Usage

Add to application and follow the graphical configuration guidelines - same as `accounts-twitter` or `accounts-facebook`.

## Access scopes

By default, `accounts-eveonline` requests the `publicData` scope. Can be configured via method options: `Meteor.loginWithEveonline({ scope: 'publicData' })`.

## User data

The following information will be added to `Meteor.users` records:

```
{
  services: {
    eveonline: {
      list: [] //collection of combination of char name and id values
      [charName]: {
        id: ..., // ID of the character that was selected in login process
        name: '...' // Name of the character that was selected in login process
        eveAccount: '...', // EvE Online account ID
        accessToken: '...', // Access token for use in CREST API calls
        refreshToken: '...', // Refresh token for updating access token
        expiresAt: ... // Timestamp when access token will expire
      }
    }
  }

```

## Helper functions

`accounts-eveonline` exposes `EveonlineHelpers` object with following helper functions:

### refreshAuthToken(user)

Calling `EveonlineHelpers.refreshAuthToken(meteorUserRecord)` will attempt to obtain new auth token from SSO server by using the refresh token.

Available only server-side. If successful, data gets updated in `Meteor.users` collection.

### changeOfOwnerofChar(userId, charName)

`EveonlineHelpers.changeOfOwnerOfChar(userId, charName)` is meant to be redefined on startup (so that package loads first and then your definition takes hold), so that it calls logic meant to deal with situation where owner of character has changed, user 1 with char 1 posts comment, user 2 now owns char 1, and thus it would make sense to delete/mark posts made by user 1 and rescind posting/viewing rights if its restricted topic.

Available only server-side. If successful, data gets updated in `Meteor.users` collection.
