import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Amina Clothing',
    short_name: 'Amina',
    description: 'Discover the elegance of modern Moroccan Caftans and Dresses.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f4f1ea',
    theme_color: '#f4f1ea',
   icons: [
  {
    src: "/logo-512.png",
    sizes: "192x192",
    type: "image/png",
  },
  {
    src: "/logo-512.png",
    sizes: "512x512",
    type: "image/png",
  },
],
  }
}