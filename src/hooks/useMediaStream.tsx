import { MutableRefObject, useEffect, useState } from "react";
import { mediaDevices, MediaStream, RTCPeerConnection } from "react-native-webrtc";

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

const useMediaStream = ({ peerConnection }: Props) => {
  const [localMediaStream, setLocalMediaStream] = useState<MediaStream | undefined>(new MediaStream(undefined))
  const remoteMediaStream = new MediaStream(undefined)
  let isVoiceOnly = false;
  const peer = peerConnection

  useEffect(() => {
    peer.current.getReceivers()
      .forEach(receiver => remoteMediaStream?.addTrack(receiver.track!))

    mediaDevices.getUserMedia(mediaConstraints)
      .then(mediaStream => {
        const tracks = mediaStream.getTracks()
        tracks.forEach(track => peer.current.addTrack(track))
        setLocalMediaStream(mediaStream);
      }).catch(error => { });

    peer.current.addEventListener('track', (e: any) => {
      remoteMediaStream?.addTrack(e.track)
    })
    // Handle Error

    // if (isVoiceOnly) {
    //   let videoTrack = await mediaStream.getVideoTracks()[0];
    //   videoTrack.enabled = false;
    // };
    peer.current.addEventListener('track', (event) => { });
  }, [])

  return [localMediaStream, remoteMediaStream, setLocalMediaStream] as const
}

export default useMediaStream