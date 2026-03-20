import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const size = {
  width: 512,
  height: 512,
};

export const contentType = 'image/png';

export default async function AppleIcon() {
  const iconPath = path.join(process.cwd(), 'public', 'Capy_Logo.png');
  const iconBuffer = await readFile(iconPath);

  return new Response(iconBuffer, {
    headers: {
      'Content-Type': contentType,
    },
  });
}
