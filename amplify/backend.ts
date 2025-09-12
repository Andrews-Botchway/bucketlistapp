import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';       // Import Auth resource
import { data } from './data/resource';       // Import Data (schema) resource
import { storage } from './storage/resource'; // Import Storage (S3) resource

// Combine all resources into a single Amplify backend
defineBackend({
  auth,    // User authentication (Cognito)
  data,    // Data models (e.g., BucketItem)
  storage, // File storage (S3 bucket)
});
