import React, { useState } from 'react';

function App() {
  const [imageNumber, setImageNumber] = useState(1000);
  const [mergedImageUrl, setMergedImageUrl] = useState('');
  const [ethereumAddress, setEthereumAddress] = useState('');

  const handleMergeImages = async () => {
    try {
      const response = await fetch(`http://localhost:3001/merge?imageNumber=${imageNumber}`);
      const mergedImageBlob = await response.blob();
      const mergedImageUrl = URL.createObjectURL(mergedImageBlob);
      setMergedImageUrl(mergedImageUrl);
    } catch (error) {
      console.error('Error merging images:', error);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = mergedImageUrl;
    link.download = 'merged_image.png'; // You can customize the filename
    link.click();
  };

  const handleEthereumAddressChange = (e) => {
    setEthereumAddress(e.target.value);
  };

  const handleDropEthereumAddress = () => {
    // Here you can perform any action you want with the Ethereum address
    console.log('Dropping Ethereum address:', ethereumAddress);
  };

  return (
    <div className="App">
      <h1>Meme-Gen</h1>
      <label htmlFor="imageNumber">Enter Doge Number:</label>
      <input
        type="number"
        id="imageNumber"
        min="1"
        step="1"
        value={imageNumber}
        onChange={(e) => setImageNumber(e.target.value)}
      />
      <button onClick={handleMergeImages}>MeME it</button>
      {mergedImageUrl && (
        <div>
          <img
            src={mergedImageUrl}
            alt="Merged Image"
            style={{ maxWidth: '40%', marginTop: '20px' }}
          />
          <button onClick={handleDownload}>Download Merged Image</button>
        </div>
      )}
      <div>
        <label htmlFor="ethereumAddress">Enter Ethereum Address:</label>
        <input
          type="text"
          id="ethereumAddress"
          value={ethereumAddress}
          onChange={handleEthereumAddressChange}
        />
        <button onClick={handleDropEthereumAddress}>Drop Ethereum Address</button>
      </div>
    </div>
  );
}

export default App;
