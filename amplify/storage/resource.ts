// Import the `defineStorage` helper from the AWS Amplify backend library
// This function is used to define and configure S3 storage settings in your Amplify project
import { defineStorage } from "@aws-amplify/backend";


// Define a new Amplify Storage resource (an Amazon S3 bucket)
export const storage = defineStorage({
  // Name of the storage bucket resource
  // This name is used internally by Amplify to identify and deploy the bucket
  name: "amplifyBucketTrackerImages",

  // Define access rules for files stored in this bucket
  access: (allow) => ({
    // The path pattern for where files will be stored inside the bucket
    // `{entity_id}` is a dynamic placeholder that represents the user's unique identity (e.g., Cognito user ID)
    "media/{entity_id}/*": [
      // Allow the authenticated entity (user) identified by "identity"
      // to perform specific actions on files under their own folder
      allow.entity("identity").to(["read", "write", "delete"]),
      // In short — each user can access only their own files within "media/{their_id}/"
    ],
  }),
});
// This file sets up an S3 bucket with user-specific access controls for a serverless application using AWS Amplify.