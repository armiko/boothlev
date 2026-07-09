import { pipeline } from '@huggingface/transformers';
async function test() {
  try {
    const pipe = await pipeline('background-removal', 'briaai/RMBG-1.4');
    console.log('background-removal loaded');
  } catch(e) {
    console.error('background-removal failed:', e.message);
  }
}
test();
