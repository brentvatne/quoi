let AWS = require('aws-sdk');
let docClient = new AWS.DynamoDB.DocumentClient();
let fetchUserAsync = require('./fetchUserAsync');
let uuid = require('uuid/v1');

exports.handler = async (event, context) => {
  try {
    console.log(event);
    console.log(context);
    let { uuid, title, author, fileUrl } = event.arguments.input;
    let user = await fetchUserAsync(uuid);
    if (!user) {
      throw new Error('Must provide a valid user id')
    } else {
      await throwIfUserBannedAsync(user.email);
    }

    let post = { title, author, fileUrl };
    console.log(post);
    let id = await savePostAsync(post);
    return {
      id,
      ...post,
    };
  } catch (e) {
    console.log(e);
    return { errorMessage: e, errorType: 'MUTATION_ERROR' };
  }
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

async function savePostAsync(post) {
  let id = uuid();
  let params = {
    TableName: 'PostTable',
    Item: { id, ...post },
  };

  return new Promise((resolve, reject) => {
    docClient.put(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(id);
      }
    });
  });
}
