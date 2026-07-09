import { pipeline, RawImage } from '@huggingface/transformers';
import fs from 'fs';

async function test() {
  const pipe = await pipeline('image-segmentation', 'Xenova/modnet');
  const buffer = fs.readFileSync('test.jpg');
  const blob = new Blob([buffer], { type: 'image/jpeg' });
  const img = await RawImage.read(blob);
  const out = await pipe(img);
  console.log('Label:', out[0].label);
  
  // Let's dump the first few bytes of the mask to see if it's 255 (solid white) or 0 (solid black)
  console.log('Mask data snippet:', out[0].mask.data.slice(0, 10));
}
test();
