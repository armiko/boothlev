import { pipeline, RawImage } from '@huggingface/transformers';
async function test() {
  try {
    const pipe = await pipeline('image-matting', 'briaai/RMBG-1.4');
    console.log('image-matting loaded');
  } catch(e) {
    console.error('image-matting failed:', e.message);
  }
  
  try {
    const pipe = await pipeline('image-feature-extraction', 'briaai/RMBG-1.4');
    console.log('image-feature-extraction loaded');
  } catch(e) {
    console.error('image-feature-extraction failed:', e.message);
  }
}
test();
