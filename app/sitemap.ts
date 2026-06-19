import { MetadataRoute } from "next"
import { posts } from "./blog/posts"

export default function sitemap(): MetadataRoute.Sitemap {
  const blogUrls = posts.map(post => ({
    url: `https://kioscoapp.com.ar/blog/${post.slug}`,
    lastModified: new Date(post.fecha),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  return [
    {
      url: "https://kioscoapp.com.ar",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://kioscoapp.com.ar/blog",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...blogUrls,
    {
      url: "https://kioscoapp.com.ar/register",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://kioscoapp.com.ar/login",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ]
}