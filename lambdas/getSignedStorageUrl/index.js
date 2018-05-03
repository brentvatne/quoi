let AWS = require('aws-sdk');
let s3 = new AWS.S3({signatureVersion: 'v4'});
let docClient = new AWS.DynamoDB.DocumentClient();
let fetchUserAsync = require('./fetchUserAsync');
let uuid = require('uuid/v1');

exports.handler = async (event, context) => {
  let id;
  if (event.body) {
    id = JSON.parse(event.body).uuid;
  } else if (event.queryStringParameters) {
    id = event.queryStringParameters.uuid;
  } else {
    id = event.uuid;
  }
  
  let user = await fetchUserAsync(id);
  if (!user) {
    throw new Error('Must provide a valid user id');
  } else {
    await throwIfUserBannedAsync(user.email);
  }

  let key = uuid();
  let params = {
    Bucket: 'quoi',
    Key: key,
    ACL: 'public-read',
    Expires: 120,
  };

  let url = await new Promise((resolve, reject) => {
    s3.getSignedUrl('putObject', params, (err, url) => {
      if (err) {
        reject(err);
      } else {
        resolve(url);
      }
    });
  });

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ signedUrl, targetUrl, key }),
    isBase64Encoded: false,
  };
};

async function throwIfUserBannedAsync(email) {
  let params = {
    TableName: 'UserBanTable',
    Key: {
      email,
    },
  };

  return new Promise((resolve, reject) => {
    docClient.get(params, (err, data) => {
      if (err) {
        reject('Unknown error');
      } else if (data.Item) {
        reject('User is banned');
      } else {
        resolve();
      }
    });
  });
}


