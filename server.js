const express = require('express');
const Jimp = require('jimp');
const app = express();
const port = 3001;
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.get('/merge', async (req, res) => {
  const imageNumber = req.query.imageNumber;
  try {
    const backgroundImage = await Jimp.read('https://upcdn.io/W142i9c/raw/background/Background.png');
    const headImage = await Jimp.read(`https://upcdn.io/W142i9c/raw/doghead/${imageNumber}.png`);
    const scaleFactor = 1;
    const newHeadWidth = headImage.getWidth() * scaleFactor;
    headImage.resize(newHeadWidth, Jimp.AUTO);
    const combinedImage = backgroundImage.clone();
    const posXHead = 30;
    const posYHead = -25;
    combinedImage.composite(headImage, posXHead, posYHead);
    const additionalLayerImage = await Jimp.read('https://upcdn.io/W142i9c/raw/background/Zebra.png');
    const additionalLayerScaleFactor = 1; // Adjust this value to make it larger or smaller
    additionalLayerImage.scale(additionalLayerScaleFactor);
    combinedImage.composite(additionalLayerImage, 0, 0);
    const mergedImageBuffer = await combinedImage.getBufferAsync(Jimp.MIME_PNG);

    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': mergedImageBuffer.length
    });
    res.end(mergedImageBuffer);
  } catch (error) {
    console.error('Error merging images:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});