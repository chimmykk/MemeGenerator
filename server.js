const express = require('express');
const Jimp = require('jimp');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const API_KEY = '85a320bbc3e447ebb881a2ce01741784'; // Replace this with your actual API key

// Mapping of fur values to image URLs
const furImageMapping = {
  'Alien': 'https://upcdn.io/W142i9c/raw/background/Alien.png',
  'Black': 'https://upcdn.io/W142i9c/raw/background/Black.png',
  'Giraffe': 'https://upcdn.io/W142i9c/raw/background/Giraffe.png',
  'Gold': 'https://upcdn.io/W142i9c/raw/background/Gold.png',
  'Gray': 'https://upcdn.io/W142i9c/raw/background/Grey.png',
  'Iceberg': 'https://upcdn.io/W142i9c/raw/background/Iceberg.png',
  'Original': 'https://upcdn.io/W142i9c/raw/background/Original.png',
  'Pink': 'https://upcdn.io/W142i9c/raw/background/Pink.png',
  'Slime': 'https://upcdn.io/W142i9c/raw/background/Slime.png',
  'Snow': 'https://upcdn.io/W142i9c/raw/background/Snow.png',
  'Tiger': 'https://upcdn.io/W142i9c/raw/background/Tiger.png',
  'Zebra': 'https://upcdn.io/W142i9c/raw/background/Zebra.png',
  'Purple': 'https://upcdn.io/W142i9c/raw/background/Purple.png',
  'Brown': 'https://upcdn.io/W142i9c/raw/background/Brown.png',
  'Leopard': 'https://upcdn.io/W142i9c/raw/background/Leopard.png',
  'Red': 'https://upcdn.io/W142i9c/raw/background/Red.png',
  'Robot': 'https://upcdn.io/W142i9c/raw/background/Robotic.png',
  'Robotic': 'https://upcdn.io/W142i9c/raw/background/Robotic.png',
  'Black': 'https://upcdn.io/W142i9c/raw/background/Black.png',
  'Green':'https://upcdn.io/W142i9c/raw/background/Green.png',
  
  'Wave':'https://upcdn.io/W142i9c/raw/background/brownish.png'
  // to be fix
  
};

app.get('/merge', async (req, res) => {
  const imageNumber = req.query.imageNumber;

  // Use the imageNumber as nftId
  const nftId = imageNumber;
  const nftApiUrl = `https://furget.onrender.com/getfur/${nftId}`; // Change to the correct URL

  try {
    const nftResponse = await axios.get(nftApiUrl, {
      headers: {
        'X-API-KEY': API_KEY,
      },
    });

    const furValue = nftResponse.data; // Assuming this is the fur trait value from the response
    console.log('Fur Value:', furValue);

    // Get the corresponding image URL from the mapping
    const additionalLayerImageUrl = furImageMapping[furValue];
    if (!additionalLayerImageUrl) {
      console.error('Invalid fur value:', furValue);
      res.status(500).json({ error: 'Invalid fur value' });
      return;
    }

    const backgroundImage = await Jimp.read('https://upcdn.io/W142i9c/raw/background/Background.png');
    const headImage = await Jimp.read(`https://upcdn.io/W142i9c/raw/doghead/${imageNumber}.png`);
    const scaleFactor = 1;
    const newHeadWidth = headImage.getWidth() * scaleFactor;
    headImage.resize(newHeadWidth, Jimp.AUTO);
    const combinedImage = backgroundImage.clone();
    const posXHead = 30;
    const posYHead = -25;
    combinedImage.composite(headImage, posXHead, posYHead);

    // Load and process the additional layer image
    const additionalLayerImage = await Jimp.read(additionalLayerImageUrl);
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
