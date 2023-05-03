import { RTCSessionDescription } from "react-native-webrtc";
import { CallData } from "./useSocket";
import { useUserContext } from "./userContext"
import { MutableRefObject, useRef, useState } from "react";

const sessionConstraints = {
  mandatory: {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: true,
    VoiceActivityDetection: true
  }
};


const useCall = () => {
  const { user } = useUserContext()
  const remoteRTCMessage = useRef()

  async function processAccept(answerCall: (data: CallData) => void) {
    const offerDescription = new RTCSessionDescription(remoteRTCMessage.current)
    await user.peerConnection?.current.setRemoteDescription(offerDescription);
    const sessionDescription = await user.peerConnection?.current.createAnswer();
    await user.peerConnection?.current.setLocalDescription(sessionDescription);
    answerCall({
      callerId: user.otherUserId,
      rtcMessage: sessionDescription,
    });
    // navigation.navigate('WebRTCRoom')
  }

  async function processCall(sendCall: (data: CallData) => void) {
    const sessionDescription = await user.peerConnection?.current.createOffer(sessionConstraints);
    await user.peerConnection!.current.setLocalDescription(sessionDescription);
    sendCall({
      callerId: user.otherUserId,
      rtcMessage: sessionDescription,
    });
    // console.log(sessionDescription)
    // navigation.navigate('WebRTCRoom')
  }

  return { processAccept, processCall, remoteRTCMessage }
}

export default useCall