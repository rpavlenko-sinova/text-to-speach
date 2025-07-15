export default async function drawIconWithCount(count: number) {
  const size = 64;
  const canvas = new OffscreenCanvas(size, size);
  const ctx = canvas.getContext('2d');

  const iconUrl = getIconUrl(64);

  const baseIcon = await loadImage(iconUrl);
  ctx.drawImage(baseIcon, 0, 0, size, size);

  ctx.fillStyle = 'red';
  ctx.fillRect(size - 20, size - 20, 20, 20);

  ctx.fillStyle = 'white';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(count.toString(), size - 10, size - 10);

  const imageData = ctx.getImageData(0, 0, size, size);

  chrome.action.setIcon({ imageData });
}

function getIconUrl(size: number): string {
  const manifest = chrome.runtime.getManifest();
  const icons = manifest.icons || {};
  const iconFilename = icons[size.toString()];

  if (iconFilename) {
    return chrome.runtime.getURL(iconFilename);
  }

  return chrome.runtime.getURL(`icon${size}.png`);
}

function loadImage(src: string): Promise<ImageBitmap> {
  return fetch(src)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
      }
      return res.blob();
    })
    .then(createImageBitmap);
}
