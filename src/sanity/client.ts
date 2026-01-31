import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "sk9drqx3",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});