let { createApolloFetch } = require('apollo-fetch');
let uri = 'https://www.react-europe.org/gql';
let apolloFetch = createApolloFetch({ uri });

let query = `
  query UserDetails($uuid:String!) {
    events(slug: "reacteurope-2018") {
      me(uuid: $uuid) {
        firstName
        lastName
        email
        id
      }
    }
  }
`;

module.exports = async function fetchUserAsync(uuid) {
  let result = await apolloFetch({ query, variables: { uuid } });
  if (!result.data) {
    return null;
  } else {
    return result.data.events[0].me;
  }
};
