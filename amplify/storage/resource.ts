import { defineStorage } from "@aws-amplify/backend";

// Define an S3 storage resource
export const storage = defineStorage({
  name: "amplifyBucketTrackerImages", // Name of the storage bucket
  access: (allow) => ({
    // Path pattern inside the bucket
    "media/{entity_id}/*": [
      // Give each signed-in user (identity) permission
      // to read, write, and delete files in their own folder
      allow.entity("identity").to(["read", "write", "delete"]),
    ],
  }),
});

//This storage configuration ensures that only the person who uploads the image can access it. 
// The entity_id will be replaced with the user’s identifier during file uploads, restricting access to the file.