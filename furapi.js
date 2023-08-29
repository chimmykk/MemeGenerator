const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import the cors middleware

const app = express();
const port = 3004;
const API_KEY = '85a320bbc3e447ebb881a2ce01741784'; // Replace this with your actual API key

app.use(express.json());
app.use(cors()); // Use the cors middleware to enable CORS

app.get('/api/:nftId', async (req, res) => {
  const nftId = req.params.nftId;

  const apiUrl = `https://api.opensea.io/api/v1/asset/0xf4ee95274741437636e748ddac70818b4ed7d043/${nftId}/`;

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        'X-API-KEY': API_KEY,
      },
    });

    const furTrait = response.data.traits.find(
      (trait) => trait.trait_type.toLowerCase() === 'fur'
    );

    if (furTrait) {
      res.json(furTrait.value);
    } else {
      res.status(404).json({ error: 'Fur trait not found' });
    }
  } catch (error) {
    console.error('Error while fetching NFT trait metadata:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});
