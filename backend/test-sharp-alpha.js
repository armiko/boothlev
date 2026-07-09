import fs from 'fs';
import sharp from 'sharp';

async function test() {
  const buffer = fs.readFileSync('test.jpg');
  const baseImg = await sharp(buffer).resize(300, 300).ensureAlpha().toBuffer(); // Make 4-channel
  
  const maskBuf = Buffer.alloc(300 * 300, 128); // 128 alpha (half transparent)
  
  try {
    const out1 = await sharp(baseImg)
      .joinChannel(maskBuf, { raw: { width: 300, height: 300, channels: 1 } })
      .png()
      .toBuffer();
      
    console.log('direct joinChannel on RGBA:', (await sharp(out1).metadata()).channels);
  } catch(e) {
    console.error('Error:', e.message);
  }
}
test();
