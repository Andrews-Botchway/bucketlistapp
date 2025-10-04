// Import the `defineBackend` function from AWS Amplify backend library
// This function is the main entry point to configure and register all backend resources
import { defineBackend } from '@aws-amplify/backend';

// Import the authentication resource we defined earlier
// This handles user login/signup using Amazon Cognito
import { auth } from './auth/resource';

// Import the data resource we defined earlier
// This includes your data models (like BucketItem) and rules for who can access them
import { data } from './data/resource';

// Import the storage resource we defined earlier
// This sets up an S3 bucket for storing files, with per-user access rules
import { storage } from './storage/resource';


// Define the Amplify backend by combining all the resources
// This is where Amplify knows which backend services to deploy
defineBackend({
  auth,    // Include user authentication
  data,    // Include your database models and schema
  storage, // Include file storage (S3 bucket)
});
// When you run `amplify push`, Amplify will read this file to know what resources to create and configure in your AWS account. 