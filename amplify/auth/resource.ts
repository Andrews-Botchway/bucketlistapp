// Import the `defineAuth` helper from AWS Amplify's backend library
// This is used to define and configure the authentication settings (like Cognito User Pools)
import { defineAuth } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 * 
 * This sets up authentication for your Amplify project using Amazon Cognito under the hood.
 */
export const auth = defineAuth({
  // Specify how users can log in to your app
  loginWith: {
    // Enable email-based login
    // Users will sign up and sign in using their email address (no username required)
    email: true,
  },
});
// You can customize this further by adding social logins (like Google, Facebook) or multi-factor authentication (MFA)