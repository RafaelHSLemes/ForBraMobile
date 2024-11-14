import { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate } from 'react-native-webrtc';

const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

// Função para criar um PeerConnection
export const createPeerConnection = () => {
  const peerConnection = new RTCPeerConnection(configuration);

  // Função para criar oferta
  const createOffer = async () => {
    const offer = await peerConnection.createOffer({});
    await peerConnection.setLocalDescription(new RTCSessionDescription(offer));
    return offer;
  };

  // Função para criar resposta
  const createAnswer = async (offer: RTCSessionDescription) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer(); // Sem argumentos
    await peerConnection.setLocalDescription(new RTCSessionDescription(answer));
    return answer;
  };

  // Função para adicionar candidato ICE
  const addIceCandidate = async (candidate: RTCIceCandidate) => {
    if (candidate) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  return {
    peerConnection,
    createOffer,
    createAnswer,
    addIceCandidate
  };
};