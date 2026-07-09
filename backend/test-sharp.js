import { pipeline, RawImage } from '@huggingface/transformers';
import fs from 'fs';
import sharp from 'sharp';

async function test() {
  const pipe = await pipeline('image-segmentation', 'Xenova/modnet');
  const buffer = fs.readFileSync('test.jpg');
  const blob = new Blob([buffer], { type: 'image/jpeg' });
  const img = await RawImage.read(blob);
  const out = await pipe(img);
  const mask = out[0].mask;
  const maskBuffer = Buffer.from(mask.data);
  
  const transparentPngBuffer = await sharp(buffer)
    .resize(mask.width, mask.height, { fit: 'fill' })
    .removeAlpha()
    .joinChannel(maskBuffer, {
      raw: {
        width: mask.width,
        height: mask.height,
        channels: 1
      }
    })
    .png()
    .toBuffer();
    
  fs.writeFileSync('out.png', transparentPngBuffer);
  console.log('Saved out.png');
}
test();
