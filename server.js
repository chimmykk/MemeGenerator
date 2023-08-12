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
    const headImage = await Jimp.read(`https://upcdn.io/W142i9c/raw/doghead/${imageNumber}.png`);
    const bodyImage = await Jimp.read('https://upcdn.io/W142i9c/raw/dogehead/part2.png');
    const backgroundImage = await Jimp.read('https://upcdn.io/W142i9c/raw/dogehead/1.png');

    const scaleFactor = 1;
    const newHeadWidth = headImage.getWidth() * scaleFactor;
    headImage.resize(newHeadWidth, Jimp.AUTO);

    // Create a new combined image by cloning the background image
    const combinedImage = backgroundImage.clone();

    // Composite the body image on top of the combined image
    combinedImage.composite(bodyImage, 0, 0);

    // Composite the head image on top of the body image
    const posXHead = 60;
    const posYHead = -5;
    combinedImage.composite(headImage, posXHead, posYHead);

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