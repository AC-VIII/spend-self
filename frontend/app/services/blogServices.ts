import { api } from "../api/api";

export async function getBlogPosts() {
  return api.get<{
    success: boolean;
    data: BlogPost[];
  }>("/api/blogs");
}

export async function getBlogPost(
  slug: string
) {
  return api.get<BlogPost>(
    `/api/blogs/${slug}`
  );
}