// src/peerHelper.js
import Peer from 'peerjs';

let peerInstance = null;

// Function to create a Peer instance if it doesn't exist
export const createPeer = () => {
  if (!peerInstance || peerInstance.disconnected) {
    peerInstance = new Peer();
  }
  return peerInstance;
};

// Function to get the Peer ID and ensure that it's generated even after a page refresh
export const getPeerId = (callback) => {
  const peer = createPeer();
  
  // Always listen for the 'open' event to retrieve the Peer ID
  peer.on('open', (id) => {
    if (id) {
      callback(id);
    } else {
      console.error('Failed to generate Peer ID.');
    }
  });
};
