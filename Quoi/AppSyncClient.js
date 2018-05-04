import AWSAppSyncClient from 'aws-appsync';
import { AUTH_TYPE } from 'aws-appsync/lib/link/auth-link';
import AppSyncConfig from './aws-exports';

export default new AWSAppSyncClient({
  url: AppSyncConfig.graphqlEndpoint,
  region: AppSyncConfig.region,
  auth: {
    type: AUTH_TYPE.AWS_IAM,
    credentials: {
      accessKeyId: AppSyncConfig.accessKeyId,
      secretAccessKey: AppSyncConfig.secretAccessKey,
    },
  },
});