import React, { useEffect, useState } from 'react';
import { View, Button } from 'react-native';
import { RTCView, MediaStream, RTCPeerConnection } from 'react-native-webrtc';
import { createPeerConnection } from '../services/webrtc/peerConnection';
import { getLocalStream, addLocalStreamToConnection, handleRemoteStream } from '../services/webrtc/mediaHandler';

const VideoCall = () => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);

  useEffect(() => {
    const initCall = async () => {
      const { peerConnection } = createPeerConnection();

      // Obter stream local
      const stream = await getLocalStream();
      if (stream) {
        setLocalStream(stream);
        addLocalStreamToConnection(peerConnection, stream);
      }

      // Gerenciar stream remota
      handleRemoteStream(peerConnection, setRemoteStream);

      setPeerConnection(peerConnection);
    };

    initCall();

    return () => {
      if (peerConnection) {
        peerConnection.close();
      }
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [peerConnection]);

  return (
    <View>
      <Button title="Encerrar Chamada" onPress={() => peerConnection?.close()} />
      {localStream && <RTCView streamURL={localStream.toURL()} style={{ width: 200, height: 200 }} />}
      {remoteStream && <RTCView streamURL={remoteStream.toURL()} style={{ width: 200, height: 200 }} />}
    </View>
  );
};

export default VideoCall;