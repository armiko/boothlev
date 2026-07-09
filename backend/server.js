import express from 'express';
import cors from 'cors';
import multer from 'multer';
import sharp from 'sharp';
import { pipeline, env, RawImage } from '@huggingface/transformers';

const app = express();
const port = 4000;

app.use(cors());

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Configure transformers.js for Node.js environment
// We don't need browser cache here, but we can set local paths if needed. 
// By default, it will download the model to the node_modules cache and use it.
env.allowLocalModels = true; // Use locally cached models

// Singleton pipeline loader
class SegmenterPipeline {
  static task = 'image-segmentation';
  static model = 'Xenova/modnet';
  static instance = null;

  static async getInstance() {
    if (this.instance === null) {
      console.log("Loading AI Model into memory... (This might take a few seconds on first run)");
      this.instance = await pipeline(this.task, this.model);
      console.log("AI Model loaded successfully!");
    }
    return this.instance;
  }
}

// Pre-load model on startup (optional, but good for UX so the first request isn't slow)
SegmenterPipeline.getInstance().catch(console.error);

app.post('/api/remove-bg', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    console.log(`Processing image: ${req.file.originalname} (${req.file.size} bytes)`);

    // Convert the buffer to a Blob that transformers.js can read
    const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
    const image = await RawImage.read(blob);

    const segmenter = await SegmenterPipeline.getInstance();
    
    // Process image
    const result = await segmenter(image);

    if (!Array.isArray(result) || result.length === 0) {
      throw new Error("Failed to process image mask.");
    }

    // result[0].mask is a RawImage { width, height, data, channels }
    const mask = result[0].mask;
    
    // Convert Uint8Array/Uint8ClampedArray to Buffer for sharp
    const maskBuffer = Buffer.from(mask.data);

    // Ensure the original image buffer is correctly sized and formatted to match the mask
    // We use sharp to resize the original image to exactly match the mask dimensions,
    // ensure it has no alpha channel initially, and then join the mask as the alpha channel!
    const transparentPngBuffer = await sharp(req.file.buffer)
      .resize(mask.width, mask.height, { fit: 'fill' }) // exact match
      .joinChannel(maskBuffer, {
        raw: {
          width: mask.width,
          height: mask.height,
          channels: 1 // grayscale mask
        }
      })
      .png()
      .toBuffer();

    // Send the resulting PNG buffer directly to the client
    res.set('Content-Type', 'image/png');
    res.send(transparentPngBuffer);

    console.log("Successfully generated and sent transparent image.");

  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Boothlev API server running at http://localhost:${port}`);
});
