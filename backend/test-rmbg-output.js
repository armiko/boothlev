import { pipeline, RawImage } from '@huggingface/transformers';
import fs from 'fs';
import sharp from 'sharp';

async function test() {
  const pipe = await pipeline('image-feature-extraction', 'briaai/RMBG-1.4');
  const buffer = fs.readFileSync('test.jpg');
  const blob = new Blob([buffer], { type: 'image/jpeg' });
  const img = await RawImage.read(blob);
  const out = await pipe(img);
  console.log('Result type:', typeof out);
  console.log('Keys/Array?', Array.isArray(out) ? 'Array' : Object.keys(out));
}
test();
