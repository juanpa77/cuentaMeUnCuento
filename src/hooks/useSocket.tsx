import { useEffect, useRef } from "react";
import { RTCIceCandidate, RTCSessionDescription } from "react-native-webrtc";
import { io } from "socket.io-client"
import { useUserContext } from "./userContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
// import useCall from "./useCall";

const sessionConstraints = {
  mandatory: {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: true,
    VoiceActivityDetection: true
  }
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>
  openModalIncomingCall: () => void
}

export type CallData = {
  callerId: string
  rtcMessage: any
}

const useSocket = ({ navigation, openModalIncomingCall }: Props) => {
  const { user, setOtherUserId } = useUserContext()
  const remoteRTCMessage = useRef<any>()
  const socket = useRef(io('http://192.168.1.7:3000', {
    transports: ['websocket'],
    query: {
      callerId: user.callerId,
    },
  }))

  useEffect(() => {
    socket.current.on('newCall', (data: CallData) => {
      remoteRTCMessage.current = data.rtcMessage
      setOtherUserId(data.callerId)
      openModalIncomingCall()
    })

    socket.current.on("callAnswered", (data: CallData) => {
      remoteRTCMessage.current = data.rtcMessage;
      user.peerConnection?.current.setRemoteDescription(
        new RTCSessionDescription(remoteRTCMessage.current)
      );
      navigation.navigate('WebRTCRoom')
    });

    socket.current.on("ICEcandidate", (data: CallData) => {
      console.log('IncomingCall', data)
      let message = data.rtcMessage;
      if (user.peerConnection?.current) {
        user.peerConnection?.current
          .addIceCandidate(new RTCIceCandidate(message.candidate))
          .then((dat: any) => {
            console.log("SUCCESS", dat);
          })
          .catch((err: any) => {
            console.log("Error", err);
          });
      }
    })


    // the onicecandid  ate method does exist
    user.peerConnection!.current.onicecandidate = (event: any) => {
      console.log(event, 'test sendICEcanditate')
      if (event.candidate) {
        sendICEcandidate({
          callerId: user.otherUserId,
          rtcMessage: {
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate,
          },
        });
      } else { console.log("End of candidates."); }
    }
    // });
    return () => {
      socket.current.off('newCall');
      socket.current.off('callAnswered');
      socket.current.off('ICEcandidate');
    };
  }, [])

  async function processAccept() {
    const offerDescription = new RTCSessionDescription(remoteRTCMessage.current)
    await user.peerConnection?.current.setRemoteDescription(offerDescription);
    const sessionDescription = await user.peerConnection?.current.createAnswer();
    await user.peerConnection?.current.setLocalDescription(sessionDescription);
    answerCall({
      callerId: user.otherUserId,
      rtcMessage: sessionDescription,
    });
  }

  const sendICEcandidate = (data: CallData) => {
    socket.current.emit('ICEcandidate', data);
  }

  async function processCall() {
    const sessionDescription = await user.peerConnection?.current.createOffer(sessionConstraints);
    console.log(sessionDescription)
    await user.peerConnection!.current.setLocalDescription(sessionDescription);
    sendCall({
      callerId: user.otherUserId,
      rtcMessage: sessionDescription,
    });
  }

  const answerCall = (data: CallData) => {
    socket.current.emit("answerCall", data);
  }

  const sendCall = (data: CallData) => {
    console.log(data)
    socket.current.emit("call", data);
  }

  return { processAccept, processCall }
}

export default useSocket