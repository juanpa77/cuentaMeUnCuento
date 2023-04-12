import { MutableRefObject, useEffect, useRef, useState } from "react";
import { mediaDevices, MediaStream, RTCPeerConnection } from "react-native-webrtc";

export const configuration = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302',
    },
    {
      urls: 'stun:stun1.l.google.com:19302',
    },
    {
      urls: 'stun:stun2.l.google.com:19302',
    },
  ],
};
export let mediaConstraints = {
  audio: true,
  video: {
    frameRate: 30,
    facingMode: 'user'
  }
};

type Props = {
  peerConnection: MutableRefObject<RTCPeerConnection>
}

const useCall = ({ peerConnection }: Props) => {
  const [localMediaStream, setLocalMediaStream] = useState<MediaStream | undefined>(new MediaStream(undefined))
  const [remoteMediaStream, setRemoteMediaStream] = useState<MediaStream | undefined>(new MediaStream(undefined))
  // const peerConnection = useRef(new RTCPeerConnection(configuration))
  let isVoiceOnly = false;

  useEffect(() => {
    peerConnection.current.getReceivers()
      .forEach(receiver => remoteMediaStream?.addTrack(receiver.track!))

    mediaDevices.getUserMedia(mediaConstraints)
      .then(mediaStream => {
        const tracks = mediaStream.getTracks()
        tracks.forEach(track => peerConnection.current.addTrack(track))
        setLocalMediaStream(mediaStream);
      }).catch(error => { });
    peerConnection.current.addEventListener('track', (e: any) => {
      remoteMediaStream?.addTrack(e.track)
    })
    // Handle Error

    // if (isVoiceOnly) {
    //   let videoTrack = await mediaStream.getVideoTracks()[0];
    //   videoTrack.enabled = false;
    // };
    peerConnection.current.addEventListener('track', (event) => { });
  }, [])

  return [localMediaStream, remoteMediaStream]
}

export default useCall