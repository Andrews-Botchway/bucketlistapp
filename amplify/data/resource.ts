// Import required functions and types from AWS Amplify's backend library
import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

// Define the data schema using Amplify's schema builder (the `a` object)
const schema = a.schema({
  // Define a model (like a database table) called "BucketItem"
  BucketItem: a
    .model({
      // Define the fields (columns) for the model
      title: a.string(),        // A string field for the item's title
      description: a.string(),  // A string field for the item's description
      image: a.string(),        // A string field for an image URL or path
    })
    // Define authorization rules for this model
    .authorization((allow) => [allow.owner()]),  
    // This means: only the user who created (owns) the item can read, update, or delete it
});

// Define a TypeScript type for the client-side schema
// This lets you get full type safety and autocompletion when using the schema in your frontend
export type Schema = ClientSchema<typeof schema>;

// Define the Amplify data configuration
export const data = defineData({
  schema,  // Use the schema we defined above
  authorizationModes: {
    // Set the default authorization mode to use the Amazon Cognito User Pool
    // This ensures that only authenticated users can interact with the data
    defaultAuthorizationMode: 'userPool',
  },
});
// This file sets up the data model and authorization for a serverless application using AWS Amplify.