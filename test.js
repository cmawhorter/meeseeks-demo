'use strict';

if (process.env.NODE_ENV !== 'development') throw new Exception('can only run in "development"');

require('dotenv').load();

var MOCK_JWT = process.env.MOCK_JWT || '...replace with a static jwt token. in dev, it is decoded only and not verified...';

// path to your lambda entry point
var app = require('./index.js');
// the handler you wish to test (you may only have one e.g. exports.handler)
var handler = app.handler;
// simulated max duration
var duration = 30000;
// the sample/mock event you'd like to use for testing
var mockEvent = {
  method: process.argv[2],
  authorization: MOCK_JWT,
  body: require('./test-events/' + process.argv[2] + '.json'),
};

// ==========================

var end = new Date().getTime() + duration;
var context = {
  awsRequestId: 'awsr-eque-stid-fake-9184',
  identity: {
    cognitoIdentityId: 'fake-identity',
  },
  getRemainingTimeInMillis: function() {
    return Math.max(0, end - new Date().getTime());
  },
  succeed: function(obj) {
    console.log('Succeeded', obj);
    process.exit();
  },
  fail: function(err) {
    console.log('Failed', err);
    process.exit(1);
  },
  done: function(err, obj) {
    if (err) {
      context.fail(err);
    }
    else {
      context.succeed(obj);
    }
  },
};

handler(mockEvent, context);
