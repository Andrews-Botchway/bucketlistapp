import { useState, useEffect } from "react";
import {
  Authenticator,
  Button,
  Text,
  TextField,
  Heading,
  Flex,
  View,
  Image,
  Grid,
  Divider,
} from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import { getUrl, uploadData } from "aws-amplify/storage";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";

/**
 * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
 */
Amplify.configure(outputs);
const client = generateClient({ authMode: "userPool" });

export default function App() {
  const [items, setItems] = useState([]);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    const { data: items } = await client.models.BucketItem.list();
    const updatedItems = await Promise.all(
      items.map(async (item) => {
        if (item.image) {
          const url = await getUrl({
            path: ({ identityId }) => `media/${identityId}/${item.image}`,
          });
          item.image = typeof url === "string" ? url : url.url;
        }
        return item;
      })
    );
    setItems(updatedItems);
  }

  async function createItem(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const file = form.get("image");

    const { data: newItem } = await client.models.BucketItem.create({
      title: form.get("title"),
      description: form.get("description"),
      image: file ? file.name : null,
    });

    if (file) {
      await uploadData({
        path: ({ identityId }) => `media/${identityId}/${file.name}`,
        data: file,
      });
    }

    fetchItems();
    event.target.reset();
    setPreview(null);
  }

  async function deleteItem({ id }) {
    await client.models.BucketItem.delete({ id });
    fetchItems();
  }

  return (
    <Authenticator>
      {({ signOut }) => (
        <Flex
          className="App"
          justifyContent="center"
          alignItems="center"
          direction="column"
          width="90%"
          margin="0 auto"
          padding="2rem"
        >
          <Flex width="100%" justifyContent="space-between" alignItems="center">
            <Heading level={1}>My Bucket List</Heading>
            <Button onClick={signOut} variation="link">
              Sign Out
            </Button>
          </Flex>

          {/* Form */}
          <View as="form" margin="2rem 0" onSubmit={createItem} width="100%">
            <Flex direction="column" gap="1.5rem">
              <TextField
                name="title"
                placeholder="Bucket List Item"
                label="Bucket List Item"
                labelHidden
                variation="quiet"
                required
              />
              <TextField
                name="description"
                placeholder="Description"
                label="Description"
                labelHidden
                variation="quiet"
                required
              />
              <View
                as="input"
                type="file"
                name="image"
                accept="image/png, image/jpeg"
                onChange={(e) =>
                  setPreview(e.target.files[0] && URL.createObjectURL(e.target.files[0]))
                }
              />
              {preview && (
                <Image
                  src={preview}
                  alt="Preview"
                  style={{ width: 200, borderRadius: "8px" }}
                />
              )}
              <Button type="submit" variation="primary">
                Add to Bucket List
              </Button>
            </Flex>
          </View>

          <Divider />

          {/* Bucket List Items */}
          <Heading level={2} margin="2rem 0">
            My Bucket List Items
          </Heading>
          <Grid
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "2rem",
              width: "100%",
            }}
          >
            {items.map((item) => (
              <Flex
                key={item.id || item.title}
                direction="column"
                alignItems="center"
                gap="1rem"
                padding="1.5rem"
                borderRadius="1rem"
                className="box"
                style={{
                  background: "rgba(255,255,255,0.9)",
                  border: "1px solid rgba(0,0,0,0.08)",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                  position: "relative",
                  overflow: "hidden",
                  transition: "transform 0.4s ease, box-shadow 0.4s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px) scale(1.03)";
                  e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.05)";
                }}
              >
                <Heading level={3}>{item.title}</Heading>
                <Text fontStyle="italic" color="#666">
                  {item.description}
                </Text>
                {item.image && (
                  <Image
                    src={item.image}
                    alt={`Visual for ${item.title}`}
                    style={{ width: "100%", borderRadius: "8px" }}
                  />
                )}
                <Button
                  variation="destructive"
                  onClick={() => deleteItem(item)}
                  style={{ marginTop: "1rem" }}
                >
                  Delete Item
                </Button>
              </Flex>
            ))}
          </Grid>
        </Flex>
      )}
    </Authenticator>
  );
}
