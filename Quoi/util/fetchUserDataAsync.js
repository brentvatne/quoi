import { createApolloFetch } from 'apollo-fetch';
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

export default async uuid => {
  let result = await apolloFetch({ query, variables: { uuid } });
  return result.data.events[0].me;
};

// let userData = await fetchUserDataAsync(
//   'hhER9W5gFToFt4lfXyonLU6vyxAtinM0s996'
// );