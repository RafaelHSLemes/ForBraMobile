// VideoPlayer.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RTCView, MediaStream } from 'react-native-webrtc'; // Import correto do MediaStream

interface VideoPlayerProps {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ localStream, remoteStream }) => {
  return (
    <View style={styles.container}>
      {localStream && (
        <RTCView
          streamURL={localStream.toURL()}
          style={styles.localVideo}
          objectFit="cover"
        />
      )}
      {remoteStream && (
        <RTCView
          streamURL={remoteStream.toURL()}
          style={styles.remoteVideo}
          objectFit="cover"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  localVideo: {
    width: '30%',
    height: '30%',
    position: 'absolute',
    top: 10,
    right: 10,
  },
  remoteVideo: {
    width: '100%',
    height: '100%',
  },
});

export default VideoPlayer;