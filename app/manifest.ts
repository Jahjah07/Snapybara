import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Snapybara Photobooth',
    short_name: 'Snapybara',
    description:
      'A playful photobooth web app for capturing, selecting, designing, and downloading photo layouts.',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#fffdf8',
    theme_color: '#e6ccb3',
    icons: [
      {
        src: '/Capy_Logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/Capy_Logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
