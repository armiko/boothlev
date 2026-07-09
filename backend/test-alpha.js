import fs from 'fs';
import sharp from 'sharp';
import { pipeline, RawImage } from '@huggingface/transformers';

async function test() {
  const pipe = await pipeline('image-segmentation', 'Xenova/modnet');
  const buffer = fs.readFileSync('test.jpg'); // use test.jpg from earlier
  const blob = new Blob([buffer], { type: 'image/jpeg' });
  const img = await RawImage.read(blob);
  const out = await pipe(img);
  const mask = out[0].mask;
  const maskBuffer = Buffer.from(mask.data);
  
  const transparentPngBuffer = await sharp(buffer)
    .resize(mask.width, mask.height, { fit: 'fill' })
    .joinChannel(maskBuffer, {
      raw: {
        width: mask.width,
        height: mask.height,
        channels: 1
      }
    })
    .png()
    .toBuffer();
    
  const meta = await sharp(transparentPngBuffer).metadata();
  console.log('Channels:', meta.channels, 'Has Alpha:', meta.hasAlpha);
  
  const raw = await sharp(transparentPngBuffer).raw().toBuffer();
  let transparentPixels = 0;
  let opaquePixels = 0;
  for (let i = 3; i < raw.length; i += meta.channels) {
    if (raw[i] === 0) transparentPixels++;
    if (raw[i] === 255) opaquePixels++;
  }
  console.log('Transparent pixels:', transparentPixels, 'Opaque:', opaquePixels, '/', raw.length / meta.channels);
}
test();
