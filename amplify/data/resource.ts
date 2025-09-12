import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

// Define a schema with one model: BucketItem
const schema = a.schema({
  BucketItem: a
    .model({
      title: a.string(),        // Title of the item
      description: a.string(),  // Description text
      image: a.string(),        // Image (URL or S3 key)
    })
    .authorization((allow) => [allow.owner()]),  // Only the creator (owner) can access it
});

// Export schema type for frontend type-safety
export type Schema = ClientSchema<typeof schema>;

// Register schema with Amplify and set auth mode to Cognito User Pool
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool', // Users must be signed in
  },
});
