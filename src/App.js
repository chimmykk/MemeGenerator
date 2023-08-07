import React, { useEffect, useRef } from 'react';

function ReactAppWithIframe() {
  const iframeRef = useRef(null);

  // Function to handle messages received from the iframe
  function handleMessageFromIframe(event) {
    // Make sure to check the origin to prevent accepting messages from untrusted sources
    if (event.origin === 'http://localhost:3001') {
      const { type } = event.data;
      if (type === 'requestButtonsInfo') {
        // Get all buttons on the parent page
        const buttons = Array.from(document.querySelectorAll('button')).map((button) => ({
          id: button.id,
          text: button.innerText,
          disabled: button.disabled,
        }));

        // Send the buttons information back to the iframe
        const iframeOrigin = 'http://localhost:3001';
        const message = { type: 'buttonsInfo', buttons };
        event.source.postMessage(message, iframeOrigin);
      }
    }
  }

  // Add an event listener to receive messages from the iframe
  useEffect(() => {
    window.addEventListener('message', handleMessageFromIframe);

    return () => {
      // Clean up event listener when component unmounts
      window.removeEventListener('message', handleMessageFromIframe);
    };
  }, []);

  return (
    <div>
      <h1>So Webpage is the main parent</h1>
      <div>
        {/* Add the ref to the iframe */}
        <iframe ref={iframeRef} title="Webpage X" src="http://localhost:3001/" width="800" height="600"></iframe>
        {/* Add buttons on the parent page */}
        <button id="button1">Button testung</button>
        <button id="button2">Button </button>
        
        {/* Add more buttons as needed */}
      </div>
    </div>
  );
}

export default ReactAppWithIframe;
