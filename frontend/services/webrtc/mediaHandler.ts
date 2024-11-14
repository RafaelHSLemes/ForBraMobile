import { 
  MediaStream as RNMediaStream, 
  MediaStreamTrack as RNMediaStreamTrack, 
  RTCPeerConnection, 
  RTCSessionDescription, 
  mediaDevices 
} from 'react-native-webrtc';

export default class MediaHandler {
  private peerConnection: RTCPeerConnection;
  private localStream: RNMediaStream | undefined;
  private recorder: MediaRecorder | null = null;

  constructor() {
    this.peerConnection = new RTCPeerConnection({});
  }

  async startLocalStream() {
    const constraints = { audio: true, video: true };
    try {
      const rnStream = await mediaDevices.getUserMedia(constraints) as RNMediaStream;
      this.localStream = rnStream;

      if (this.localStream && 'MediaRecorder' in window) {
        this.startRecording(this.localStream as unknown as MediaStream);
      } else {
        console.warn("MediaRecorder not supported on this platform.");
      }

      this.localStream.getTracks().forEach((track: RNMediaStreamTrack) => {
        this.peerConnection.addTrack(track, this.localStream!);
      });

    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  }

  private startRecording(stream: MediaStream) {
    this.recorder = new MediaRecorder(stream);

    this.recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        console.log("Recording data available:", event.data);
      }
    };

    this.recorder.start(1000);
  }

  async createOffer() {
    try {
      const offer = await this.peerConnection.createOffer({});
      await this.peerConnection.setLocalDescription(offer);
      return offer;
    } catch (error) {
      console.error("Error creating offer:", error);
      throw error;
    }
  }

  async setRemoteDescription(description: RTCSessionDescription) {
    try {
      await this.peerConnection.setRemoteDescription(description);
    } catch (error) {
      console.error("Error setting remote description:", error);
    }
  }

  async createAnswer() {
    try {
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      return answer;
    } catch (error) {
      console.error("Error creating answer:", error);
      throw error;
    }
  }

  stop() {
    if (this.recorder) {
      this.recorder.stop();
      this.recorder = null;
    }
    if (this.localStream) {
      this.localStream.getTracks().forEach((track: RNMediaStreamTrack) => {
        track.stop();
      });
      this.localStream = undefined;
    }
    this.peerConnection.close();
  }
}

// Funções exportadas

export const getLocalStream = async () => {
  const constraints = { audio: true, video: true };
  try {
    const stream = await mediaDevices.getUserMedia(constraints) as RNMediaStream;
    return stream;
  } catch (error) {
    console.error("Error getting local stream:", error);
    throw error;
  }
};

export const addLocalStreamToConnection = (connection: RTCPeerConnection, stream: RNMediaStream) => {
  stream.getTracks().forEach((track: RNMediaStreamTrack) => {
    connection.addTrack(track, stream);
  });
};

export const handleRemoteStream = (connection: RTCPeerConnection, setRemoteStream: (stream: RNMediaStream) => void) => {
  if ('ontrack' in connection) {
    connection.ontrack = (event: RTCTrackEvent) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0] as unknown as RNMediaStream);
      }
    };
  } else {
    console.warn("The ontrack event is not supported in this RTCPeerConnection instance.");
  }
};